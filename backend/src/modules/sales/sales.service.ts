import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Sale } from './entities/sale.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateSaleDto, UpdateSaleDto, MoveSaleDto } from './dto/sale.dto';
import { SalesPipelineStatus } from '../../common/enums/status.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateSaleDto, tenantId: string, createdBy: string) {
    const sale = this.saleRepository.create({ ...dto, tenantId });
    const saved = await this.saleRepository.save(sale);
    this.eventEmitter.emit('sale.created', { sale: saved, createdBy });
    return saved;
  }

  async findAll(query: PaginationDto, tenantId: string) {
    const qb = this.saleRepository
      .createQueryBuilder('s')
      .where('s.tenant_id = :tenantId', { tenantId })
      .andWhere('s.deleted_at IS NULL');

    if (query.search) {
      qb.andWhere('(s.title ILIKE :search)', { search: `%${query.search}%` });
    }

    qb.orderBy('s.kanban_order', 'ASC')
      .addOrderBy('s.created_at', 'DESC')
      .take(query.limit)
      .skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async getKanbanBoard(tenantId: string) {
    const sales = await this.saleRepository.find({
      where: { tenantId },
      order: { kanbanOrder: 'ASC' },
    });

    const board: Record<string, Sale[]> = {
      [SalesPipelineStatus.LEAD]: [],
      [SalesPipelineStatus.CONTACT]: [],
      [SalesPipelineStatus.NEGOTIATION]: [],
      [SalesPipelineStatus.WON]: [],
      [SalesPipelineStatus.LOST]: [],
    };

    sales.forEach((sale) => {
      if (board[sale.status]) board[sale.status].push(sale);
    });

    return board;
  }

  async moveSale(id: string, dto: MoveSaleDto, tenantId: string) {
    const sale = await this.findOne(id, tenantId);
    const oldStatus = sale.status;
    sale.status = dto.status;
    sale.kanbanOrder = dto.order ?? sale.kanbanOrder;
    if (dto.status === SalesPipelineStatus.WON) {
      sale.actualCloseDate = new Date();
    }
    const updated = await this.saleRepository.save(sale);
    this.eventEmitter.emit('sale.moved', { sale: updated, oldStatus });
    return updated;
  }

  async findOne(id: string, tenantId: string) {
    const sale = await this.saleRepository.findOne({ where: { id, tenantId } });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async update(id: string, dto: UpdateSaleDto, tenantId: string) {
    const sale = await this.findOne(id, tenantId);
    return this.saleRepository.save({ ...sale, ...dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.saleRepository.softDelete(id);
    return { message: 'Sale deleted' };
  }

  async getPipelineStats(tenantId: string) {
    const qb = this.saleRepository
      .createQueryBuilder('s')
      .where('s.tenant_id = :tenantId', { tenantId })
      .andWhere('s.deleted_at IS NULL');

    const byStatus = await qb
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(s.amount)', 'totalAmount')
      .groupBy('s.status')
      .getRawMany();

    const totalPipeline = await qb
      .clone()
      .select('SUM(s.amount * s.win_probability / 100)', 'weighted')
      .getRawOne();

    return { byStatus, weightedPipeline: parseFloat(totalPipeline?.weighted || '0') };
  }
}
