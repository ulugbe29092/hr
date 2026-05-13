import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Status } from '../../../common/enums/status.enum';

export enum ClientType {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export enum ClientSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  COLD_CALL = 'cold_call',
  EMAIL = 'email',
  EVENT = 'event',
  OTHER = 'other',
}

@Entity('clients')
@Index(['tenantId', 'email'])
export class Client extends BaseEntity {
  @Column({ type: 'enum', enum: ClientType, default: ClientType.COMPANY })
  type: ClientType;

  @Column()
  name: string;

  @Column({ nullable: true })
  @Index()
  email?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ name: 'company_size', nullable: true })
  companySize?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({ type: 'enum', enum: ClientSource, nullable: true })
  source?: ClientSource;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ name: 'total_deals', default: 0 })
  totalDeals: number;

  @Column({ name: 'last_contact_at', type: 'timestamptz', nullable: true })
  lastContactAt?: Date;

  @Column({ type: 'jsonb', name: 'contacts', default: [] })
  contacts: ClientContact[];

  @Column({ type: 'jsonb', name: 'social_links', default: {} })
  socialLinks: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', name: 'tags', default: [] })
  tags: string[];

  @Column({ name: 'tax_number', nullable: true })
  taxNumber?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
}
