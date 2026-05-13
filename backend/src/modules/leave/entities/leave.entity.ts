import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LeaveStatus } from '../../../common/enums/status.enum';

export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  UNPAID = 'unpaid',
  EMERGENCY = 'emergency',
  STUDY = 'study',
  OTHER = 'other',
}

@Entity('leaves')
@Index(['employeeId', 'startDate'])
export class Leave extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'enum', enum: LeaveType })
  type: LeaveType;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'total_days', type: 'decimal', precision: 4, scale: 1 })
  totalDays: number;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @Column()
  reason: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'rejection_reason', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl?: string;

  @Column({ name: 'is_half_day', default: false })
  isHalfDay: boolean;
}

@Entity('leave_balances')
@Index(['employeeId', 'year', 'type'], { unique: true })
export class LeaveBalance extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: LeaveType })
  type: LeaveType;

  @Column({ name: 'total_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  totalDays: number;

  @Column({ name: 'used_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  usedDays: number;

  @Column({ name: 'remaining_days', type: 'decimal', precision: 5, scale: 1, default: 0 })
  remainingDays: number;
}
