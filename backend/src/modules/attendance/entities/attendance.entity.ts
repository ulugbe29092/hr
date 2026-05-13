import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AttendanceType, AttendanceMethod } from '../../../common/enums/status.enum';

@Entity('attendance')
@Index(['employeeId', 'date'])
export class Attendance extends BaseEntity {
  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'check_in', type: 'timestamptz', nullable: true })
  checkIn?: Date;

  @Column({ name: 'check_out', type: 'timestamptz', nullable: true })
  checkOut?: Date;

  @Column({
    type: 'enum',
    enum: AttendanceMethod,
    default: AttendanceMethod.MANUAL,
  })
  method: AttendanceMethod;

  @Column({ name: 'work_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  workHours?: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'is_late', default: false })
  isLate: boolean;

  @Column({ name: 'late_minutes', default: 0 })
  lateMinutes: number;

  @Column({ name: 'location', type: 'jsonb', nullable: true })
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };

  @Column({ name: 'qr_code', nullable: true })
  qrCode?: string;

  @Column({ name: 'face_id_verified', default: false })
  faceIdVerified: boolean;

  @Column({ nullable: true })
  notes?: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy?: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;
}
