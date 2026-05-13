import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Status } from '../../../common/enums/status.enum';

export enum VacancyStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
  ON_HOLD = 'on_hold',
  FILLED = 'filled',
}

export enum CandidateStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  TECHNICAL = 'technical',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum ExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
}

@Entity('vacancies')
export class Vacancy extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', name: 'requirements' })
  requirements: string;

  @Column({ type: 'enum', enum: VacancyStatus, default: VacancyStatus.DRAFT })
  status: VacancyStatus;

  @Column({ type: 'enum', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;

  @Column({ name: 'employment_type' })
  employmentType: string;

  @Column({ name: 'salary_min', type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryMin?: number;

  @Column({ name: 'salary_max', type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryMax?: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ name: 'is_remote', default: false })
  isRemote: boolean;

  @Column({ name: 'deadline', type: 'date', nullable: true })
  deadline?: Date;

  @Column({ name: 'positions_count', default: 1 })
  positionsCount: number;

  @Column({ name: 'hired_count', default: 0 })
  hiredCount: number;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ type: 'jsonb', name: 'skills_required', default: [] })
  skillsRequired: string[];

  @Column({ type: 'jsonb', name: 'benefits', default: [] })
  benefits: string[];
}

@Entity('candidates')
@Index(['tenantId', 'email'])
export class Candidate extends BaseEntity {
  @Column({ name: 'vacancy_id' })
  vacancyId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'cv_url', nullable: true })
  cvUrl?: string;

  @Column({ name: 'portfolio_url', nullable: true })
  portfolioUrl?: string;

  @Column({ name: 'linkedin_url', nullable: true })
  linkedinUrl?: string;

  @Column({ type: 'enum', enum: CandidateStatus, default: CandidateStatus.APPLIED })
  status: CandidateStatus;

  @Column({ name: 'ai_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  aiScore?: number;

  @Column({ name: 'ai_analysis', type: 'jsonb', nullable: true })
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    matchScore: number;
    recommendation: string;
    skills: string[];
  };

  @Column({ name: 'kanban_order', default: 0 })
  kanbanOrder: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @Column({ type: 'jsonb', name: 'interviews', default: [] })
  interviews: Interview[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'source', nullable: true })
  source?: string;

  @Column({ name: 'expected_salary', type: 'decimal', precision: 12, scale: 2, nullable: true })
  expectedSalary?: number;

  @Column({ name: 'years_of_experience', type: 'decimal', precision: 4, scale: 1, nullable: true })
  yearsOfExperience?: number;
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  scheduledAt: Date;
  interviewers: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: string;
  rating?: number;
}
