import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product, StockMovement } from './entities/product.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateProductDto, UpdateProductDto, StockMovementDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(StockMovement) private movementRepo: Repository<StockMovement>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createProduct(dto: CreateProductDto, tenantId: string) {
    const product = this.productRepo.create({ ...dto, tenantId });
    return this.productRepo.save(product);
  }

  async findAll(query: PaginationDto, tenantId: string) {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .where('p.tenant_id = :tenantId', { tenantId })
      .andWhere('p.deleted_at IS NULL');

    if (query.search) qb.andWhere('(p.name ILIKE :s OR p.sku ILIKE :s)', { s: `%${query.search}%` });
    qb.orderBy('p.created_at', 'DESC').take(query.limit).skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const p = await this.productRepo.findOne({ where: { id, tenantId } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async update(id: string, dto: UpdateProductDto, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    return this.productRepo.save({ ...product, ...dto });
  }

  async adjustStock(id: string, dto: StockMovementDto, tenantId: string, createdBy: string) {
    const product = await this.findOne(id, tenantId);
    const previousStock = product.stockQuantity;
    const newStock = dto.movementType === 'in'
      ? previousStock + dto.quantity
      : previousStock - dto.quantity;

    if (newStock < 0) throw new Error('Insufficient stock');

    product.stockQuantity = newStock;
    await this.productRepo.save(product);

    const movement = this.movementRepo.create({
      productId: id,
      movementType: dto.movementType,
      quantity: dto.quantity,
      previousStock,
      newStock,
      unitCost: dto.unitCost,
      notes: dto.notes,
      createdBy,
      tenantId,
    });
    await this.movementRepo.save(movement);

    if (newStock <= product.minStockLevel) {
      this.eventEmitter.emit('inventory.low_stock', { product, newStock });
    }

    return { product, movement };
  }

  async getLowStockAlerts(tenantId: string) {
    return this.productRepo
      .createQueryBuilder('p')
      .where('p.tenant_id = :tenantId', { tenantId })
      .andWhere('p.stock_quantity <= p.min_stock_level')
      .andWhere('p.is_trackable = true')
      .getMany();
  }

  async getStats(tenantId: string) {
    const qb = this.productRepo.createQueryBuilder('p').where('p.tenant_id = :tenantId', { tenantId });
    const [total, lowStock, totalValue] = await Promise.all([
      qb.getCount(),
      qb.clone().andWhere('p.stock_quantity <= p.min_stock_level').getCount(),
      qb.clone().select('SUM(p.stock_quantity * p.cost_price)', 'total').getRawOne(),
    ]);
    return { total, lowStock, totalValue: parseFloat(totalValue?.total || '0') };
  }
}
