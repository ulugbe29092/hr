import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SalesPipelineStatus } from '../../../common/enums/status.enum';

export enum SalePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('sales')
@Index(['tenantId', 'clientId'])
export class Sale extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'assigned_to' })
  assignedTo: string;

  @Column({
    type: 'enum',
    enum: SalesPipelineStatus,
    default: SalesPipelineStatus.LEAD,
  })
  status: SalesPipelineStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ name: 'expected_close_date', type: 'date', nullable: true })
  expectedCloseDate?: Date;

  @Column({ name: 'actual_close_date', type: 'date', nullable: true })
  actualCloseDate?: Date;

  @Column({ name: 'win_probability', type: 'int', default: 0 })
  winProbability: number; // 0-100

  @Column({ type: 'enum', enum: SalePriority, default: SalePriority.MEDIUM })
  priority: SalePriority;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'lost_reason', nullable: true })
  lostReason?: string;

  @Column({ name: 'kanban_order', default: 0 })
  kanbanOrder: number;

  @Column({ type: 'jsonb', name: 'activities', default: [] })
  activities: SaleActivity[];

  @Column({ type: 'jsonb', name: 'products', default: [] })
  products: SaleProduct[];

  @Column({ type: 'jsonb', name: 'tags', default: [] })
  tags: string[];

  @Column({ name: 'next_follow_up', type: 'timestamptz', nullable: true })
  nextFollowUp?: Date;

  @Column({ name: 'currency', default: 'USD' })
  currency: string;
}

export interface SaleActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface SaleProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}
