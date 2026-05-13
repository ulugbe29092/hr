import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from './entities/client.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateClientDto, tenantId: string, createdBy: string) {
    if (dto.email) {
      const existing = await this.clientRepository.findOne({
        where: { email: dto.email, tenantId },
      });
      if (existing) throw new ConflictException('Client with this email already exists');
    }

    const client = this.clientRepository.create({ ...dto, tenantId });
    const saved = await this.clientRepository.save(client);
    this.eventEmitter.emit('client.created', { client: saved, createdBy });
    return saved;
  }

  async findAll(query: PaginationDto, tenantId: string) {
    const qb = this.clientRepository
      .createQueryBuilder('c')
      .where('c.tenant_id = :tenantId', { tenantId })
      .andWhere('c.deleted_at IS NULL');

    if (query.search) {
      qb.andWhere(
        '(c.name ILIKE :s OR c.email ILIKE :s OR c.phone_number ILIKE :s OR c.industry ILIKE :s)',
        { s: `%${query.search}%` },
      );
    }

    qb.orderBy(`c.${query.sortBy || 'created_at'}`, query.sortOrder || 'DESC')
      .take(query.limit)
      .skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const client = await this.clientRepository.findOne({ where: { id, tenantId } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, dto: UpdateClientDto, tenantId: string, updatedBy: string) {
    const client = await this.findOne(id, tenantId);
    const updated = await this.clientRepository.save({ ...client, ...dto });
    this.eventEmitter.emit('client.updated', { client: updated, updatedBy });
    return updated;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const client = await this.findOne(id, tenantId);
    await this.clientRepository.softDelete(id);
    this.eventEmitter.emit('client.deleted', { client, deletedBy });
    return { message: 'Client deleted successfully' };
  }

  async getStats(tenantId: string) {
    const qb = this.clientRepository
      .createQueryBuilder('c')
      .where('c.tenant_id = :tenantId', { tenantId })
      .andWhere('c.deleted_at IS NULL');

    const [total, active, totalRevenue, bySource] = await Promise.all([
      qb.getCount(),
      qb.clone().andWhere("c.status = 'active'").getCount(),
      qb.clone().select('SUM(c.total_revenue)', 'total').getRawOne(),
      qb.clone()
        .select('c.source', 'source')
        .addSelect('COUNT(*)', 'count')
        .groupBy('c.source')
        .getRawMany(),
    ]);

    return {
      total,
      active,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      bySource,
    };
  }
}
