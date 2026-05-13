import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum PayrollStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('payrolls')
@Index(['employeeId', 'month', 'year'], { unique: true })
export class Payroll extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column()
  month: number; // 1-12

  @Column()
  year: number;

  @Column({ name: 'base_salary', type: 'decimal', precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ name: 'overtime_pay', type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtimePay: number;

  @Column({ name: 'bonus', type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonus: number;

  @Column({ name: 'allowances', type: 'decimal', precision: 10, scale: 2, default: 0 })
  allowances: number;

  @Column({ name: 'deductions', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deductions: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'social_security', type: 'decimal', precision: 10, scale: 2, default: 0 })
  socialSecurity: number;

  @Column({ name: 'fines', type: 'decimal', precision: 10, scale: 2, default: 0 })
  fines: number;

  @Column({ name: 'net_salary', type: 'decimal', precision: 12, scale: 2 })
  netSalary: number;

  @Column({ name: 'gross_salary', type: 'decimal', precision: 12, scale: 2 })
  grossSalary: number;

  @Column({ name: 'working_days', default: 0 })
  workingDays: number;

  @Column({ name: 'absent_days', default: 0 })
  absentDays: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
  status: PayrollStatus;

  @Column({ name: 'payment_date', type: 'date', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod?: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy?: string;

  @Column({ name: 'breakdown', type: 'jsonb', default: {} })
  breakdown: Record<string, number>;

  @Column({ nullable: true })
  notes?: string;
}
