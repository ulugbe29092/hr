import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditLog, AuditAction } from './entities/audit-log.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(data: {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    entityName?: string;
    oldValues?: any;
    newValues?: any;
    changedFields?: string[];
    ipAddress?: string;
    userAgent?: string;
    description?: string;
    tenantId: string;
    isSensitive?: boolean;
  }) {
    const log = this.auditRepo.create({
      ...data,
      changedFields: data.changedFields || [],
    });
    return this.auditRepo.save(log);
  }

  async findAll(query: PaginationDto, tenantId: string, filters?: {
    userId?: string;
    entityType?: string;
    action?: AuditAction;
  }) {
    const qb = this.auditRepo
      .createQueryBuilder('a')
      .where('a.tenant_id = :tenantId', { tenantId })
      .orderBy('a.created_at', 'DESC')
      .take(query.limit)
      .skip(query.skip);

    if (filters?.userId) qb.andWhere('a.user_id = :userId', { userId: filters.userId });
    if (filters?.entityType) qb.andWhere('a.entity_type = :et', { et: filters.entityType });
    if (filters?.action) qb.andWhere('a.action = :action', { action: filters.action });

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async getEntityHistory(entityType: string, entityId: string, tenantId: string) {
    return this.auditRepo.find({
      where: { entityType, entityId, tenantId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
