import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Entity('audit_logs')
@Index(['tenantId', 'userId', 'createdAt'])
@Index(['tenantId', 'entityType', 'entityId'])
export class AuditLog extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ name: 'user_email', nullable: true })
  userEmail?: string;

  @Column({ name: 'user_role', nullable: true })
  userRole?: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ name: 'entity_type' })
  entityType: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId?: string;

  @Column({ name: 'entity_name', nullable: true })
  entityName?: string;

  @Column({ type: 'jsonb', name: 'old_values', nullable: true })
  oldValues?: Record<string, any>;

  @Column({ type: 'jsonb', name: 'new_values', nullable: true })
  newValues?: Record<string, any>;

  @Column({ type: 'jsonb', name: 'changed_fields', default: [] })
  changedFields: string[];

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ name: 'request_id', nullable: true })
  requestId?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'is_sensitive', default: false })
  isSensitive: boolean;
}
