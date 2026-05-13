import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NotificationType } from '../../../common/enums/status.enum';

@Entity('notifications')
@Index(['userId', 'isRead', 'createdAt'])
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
  type: NotificationType;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date;

  @Column({ name: 'action_url', nullable: true })
  actionUrl?: string;

  @Column({ name: 'related_entity_id', nullable: true })
  relatedEntityId?: string;

  @Column({ name: 'related_entity_type', nullable: true })
  relatedEntityType?: string;

  @Column({ type: 'jsonb', name: 'metadata', default: {} })
  metadata: Record<string, any>;

  @Column({ name: 'sent_via', type: 'jsonb', default: [] })
  sentVia: ('app' | 'email' | 'sms' | 'telegram' | 'push')[];
}
