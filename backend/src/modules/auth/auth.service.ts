import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
  Verify2FADto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { UserRole } from '../../common/enums/role.enum';
import { Status } from '../../common/enums/status.enum';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MINUTES = 30;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  // ─── Register ────────────────────────────────────────────────────────────────
  async register(dto: RegisterDto, tenantId: string = 'nexus') {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email, tenantId },
    });
    if (existing) throw new ConflictException('Email already registered');

    const user = this.userRepository.create({
      ...dto,
      tenantId,
      role: dto.role || UserRole.EMPLOYEE,
    });
    await this.userRepository.save(user);

    this.eventEmitter.emit('user.registered', { user });
    return this.generateTokens(user);
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ip: string, userAgent: string, tenantId: string = 'nexus') {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, tenantId },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status === Status.SUSPENDED)
      throw new UnauthorizedException('Account suspended');
    if (user.isLocked())
      throw new UnauthorizedException(
        `Account locked until ${user.lockedUntil?.toISOString()}`,
      );

    const isValid = await user.validatePassword(dto.password);
    if (!isValid) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockedUntil = null as any;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ip;

    // Track device
    const deviceHistory = user.deviceHistory || [];
    const existingDevice = deviceHistory.find((d) => d.deviceId === dto.deviceId);
    if (existingDevice) {
      existingDevice.lastUsed = new Date();
    } else if (dto.deviceId) {
      deviceHistory.push({
        deviceId: dto.deviceId || uuidv4(),
        userAgent,
        ip,
        lastUsed: new Date(),
      });
      if (deviceHistory.length > 10) deviceHistory.shift();
    }
    user.deviceHistory = deviceHistory;
    await this.userRepository.save(user);

    // 2FA check
    if (user.isTwoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    this.eventEmitter.emit('user.login', { user, ip, userAgent });
    return this.generateTokens(user);
  }

  // ─── OTP Login ───────────────────────────────────────────────────────────────
  async sendOtp(email: string, tenantId: string = 'nexus') {
    const user = await this.userRepository.findOne({
      where: { email, tenantId },
    });
    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await this.userRepository.save(user);

    this.eventEmitter.emit('auth.otp.send', { user, otp });
    return { message: 'OTP sent to email' };
  }

  async verifyOtp(dto: VerifyOtpDto, tenantId: string = 'nexus') {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, tenantId },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.otpCode || !user.otpExpiresAt)
      throw new BadRequestException('No OTP requested');
    if (new Date() > user.otpExpiresAt)
      throw new BadRequestException('OTP expired');
    if (user.otpCode !== dto.otp)
      throw new BadRequestException('Invalid OTP');

    user.otpCode = null as any;
    user.otpExpiresAt = null as any;
    user.isEmailVerified = true;
    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────────
  async googleLogin(googleUser: any, tenantId: string = 'nexus') {
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email, tenantId },
    });

    if (!user) {
      user = this.userRepository.create({
        ...googleUser,
        tenantId,
        isEmailVerified: true,
        role: UserRole.EMPLOYEE,
      });
      await this.userRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = googleUser.googleId;
      await this.userRepository.save(user);
    }

    return this.generateTokens(user);
  }

  // ─── 2FA ─────────────────────────────────────────────────────────────────────
  async setup2FA(userId: string) {
    const user = await this.findUserById(userId);
    const secret = speakeasy.generateSecret({
      name: `NEXUS (${user.email})`,
      length: 20,
    });

    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode };
  }

  async enable2FA(userId: string, dto: Verify2FADto) {
    const user = await this.findUserById(userId);
    if (!user.twoFactorSecret)
      throw new BadRequestException('2FA not set up');

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
      window: 2,
    });
    if (!isValid) throw new BadRequestException('Invalid 2FA token');

    user.isTwoFactorEnabled = true;
    await this.userRepository.save(user);
    return { message: '2FA enabled successfully' };
  }

  async verify2FA(userId: string, dto: Verify2FADto) {
    const user = await this.findUserById(userId);
    if (!user.twoFactorSecret)
      throw new BadRequestException('2FA not configured');

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
      window: 2,
    });
    if (!isValid) throw new UnauthorizedException('Invalid 2FA token');

    return this.generateTokens(user);
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────────
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.findUserById(payload.sub);
      if (!user.refreshToken || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ─── Password ─────────────────────────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findUserById(userId);
    const isValid = await user.validatePassword(dto.currentPassword);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    user.password = dto.newPassword;
    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto, tenantId: string = 'nexus') {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, tenantId },
    });
    if (!user) return { message: 'If email exists, reset link has been sent' };

    const token = uuidv4();
    user.otpCode = token;
    user.otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userRepository.save(user);

    this.eventEmitter.emit('auth.password.reset', { user, token });
    return { message: 'If email exists, reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto, tenantId: string = 'nexus') {
    const user = await this.userRepository.findOne({
      where: { otpCode: dto.token, tenantId },
    });
    if (!user || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = dto.newPassword;
    user.otpCode = null as any;
    user.otpExpiresAt = null as any;
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────────
  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null as any });
    return { message: 'Logged out successfully' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    await this.userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        tenantId: user.tenantId,
        isEmailVerified: user.isEmailVerified,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    };
  }

  private async handleFailedLogin(user: User) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(
        Date.now() + this.LOCK_DURATION_MINUTES * 60 * 1000,
      );
      this.eventEmitter.emit('auth.account.locked', { user });
    }
    await this.userRepository.save(user);
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
