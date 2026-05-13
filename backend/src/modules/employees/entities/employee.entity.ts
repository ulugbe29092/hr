import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Status } from '../../../common/enums/status.enum';

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  REMOTE = 'remote',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('employees')
@Index(['tenantId', 'employeeCode'], { unique: true })
export class Employee extends BaseEntity {
  @Column({ name: 'employee_code', unique: true })
  employeeCode: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'full_name', insert: false, update: false, select: false })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({ name: 'job_title' })
  jobTitle: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId?: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId?: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
    name: 'employment_type',
  })
  employmentType: EmploymentType;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'base_salary' })
  baseSalary: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ name: 'emergency_contact', type: 'jsonb', nullable: true })
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @Column({ type: 'jsonb', name: 'skills', default: [] })
  skills: string[];

  @Column({ type: 'jsonb', name: 'documents', default: [] })
  documents: EmployeeDocument[];

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'kpi_score', default: 0 })
  kpiScore: number;

  @Column({ name: 'work_location', nullable: true })
  workLocation?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}
