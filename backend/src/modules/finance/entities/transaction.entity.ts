import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum TransactionCategory {
  SALARY = 'salary',
  RENT = 'rent',
  UTILITIES = 'utilities',
  MARKETING = 'marketing',
  SALES = 'sales',
  INVESTMENT = 'investment',
  TAX = 'tax',
  INSURANCE = 'insurance',
  EQUIPMENT = 'equipment',
  TRAVEL = 'travel',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('transactions')
@Index(['tenantId', 'type', 'date'])
export class Transaction extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionCategory })
  category: TransactionCategory;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus;

  @Column({ name: 'reference_number', nullable: true })
  referenceNumber?: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod?: string;

  @Column({ name: 'account_id', nullable: true })
  accountId?: string;

  @Column({ name: 'related_entity_id', nullable: true })
  relatedEntityId?: string;

  @Column({ name: 'related_entity_type', nullable: true })
  relatedEntityType?: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl?: string;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'jsonb', name: 'tags', default: [] })
  tags: string[];

  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurring_interval', nullable: true })
  recurringInterval?: string;
}
