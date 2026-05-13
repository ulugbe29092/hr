import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/role.enum';
import { Status } from '../../../common/enums/status.enum';

@Entity('users')
@Index(['email', 'tenantId'], { unique: true })
export class User extends BaseEntity {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'google_id', nullable: true })
  @Exclude()
  googleId?: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_two_factor_enabled', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', nullable: true })
  @Exclude()
  twoFactorSecret?: string;

  @Column({ name: 'otp_code', nullable: true, type: 'varchar' })
  @Exclude()
  otpCode?: string | null;

  @Column({ name: 'otp_expires_at', nullable: true, type: 'timestamptz' })
  @Exclude()
  otpExpiresAt?: Date | null;

  @Column({ name: 'refresh_token', nullable: true, type: 'text' })
  @Exclude()
  refreshToken?: string | null;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIp?: string;

  @Column({ name: 'login_attempts', default: 0 })
  @Exclude()
  loginAttempts: number;

  @Column({ name: 'locked_until', nullable: true, type: 'timestamptz' })
  lockedUntil?: Date | null;

  @Column({ type: 'jsonb', name: 'device_history', default: [] })
  @Exclude()
  deviceHistory: DeviceInfo[];

  @Column({ type: 'jsonb', name: 'permissions', default: [] })
  permissions: string[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < new Date(this.lockedUntil);
  }
}

export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  ip: string;
  lastUsed: Date;
  location?: string;
}
