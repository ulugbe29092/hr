import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Leave, LeaveBalance } from './entities/leave.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateLeaveDto, ApproveLeaveDto } from './dto/leave.dto';
import { LeaveStatus } from '../../common/enums/status.enum';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private leaveRepo: Repository<Leave>,
    @InjectRepository(LeaveBalance) private balanceRepo: Repository<LeaveBalance>,
    private eventEmitter: EventEmitter2,
  ) {}

  async request(dto: CreateLeaveDto, tenantId: string) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) throw new BadRequestException('End date must be after start date');

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = dto.isHalfDay ? 0.5 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check balance
    const balance = await this.balanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        type: dto.type,
        year: start.getFullYear(),
        tenantId,
      },
    });
    if (balance && balance.remainingDays < totalDays) {
      throw new BadRequestException(`Insufficient leave balance. Available: ${balance.remainingDays} days`);
    }

    const leave = this.leaveRepo.create({ ...dto, totalDays, tenantId });
    const saved = await this.leaveRepo.save(leave);
    this.eventEmitter.emit('leave.requested', { leave: saved });
    return saved;
  }

  async approve(id: string, dto: ApproveLeaveDto, tenantId: string, approvedBy: string) {
    const leave = await this.findOne(id, tenantId);
    if (leave.status !== LeaveStatus.PENDING)
      throw new BadRequestException('Leave is not in pending status');

    leave.status = dto.approved ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
    leave.approvedBy = approvedBy;
    leave.approvedAt = new Date();
    leave.rejectionReason = dto.rejectionReason;

    if (dto.approved) {
      // Deduct from balance
      const balance = await this.balanceRepo.findOne({
        where: {
          employeeId: leave.employeeId,
          type: leave.type,
          year: new Date(leave.startDate).getFullYear(),
          tenantId,
        },
      });
      if (balance) {
        balance.usedDays += leave.totalDays;
        balance.remainingDays -= leave.totalDays;
        await this.balanceRepo.save(balance);
      }
    }

    const saved = await this.leaveRepo.save(leave);
    this.eventEmitter.emit('leave.approved', { leave: saved, approved: dto.approved });
    return saved;
  }

  async findAll(query: PaginationDto, tenantId: string, employeeId?: string) {
    const qb = this.leaveRepo
      .createQueryBuilder('l')
      .where('l.tenant_id = :tenantId', { tenantId });

    if (employeeId) qb.andWhere('l.employee_id = :employeeId', { employeeId });
    qb.orderBy('l.created_at', 'DESC').take(query.limit).skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const leave = await this.leaveRepo.findOne({ where: { id, tenantId } });
    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }

  async getBalance(employeeId: string, year: number, tenantId: string) {
    return this.balanceRepo.find({
      where: { employeeId, year, tenantId },
    });
  }

  async initBalance(employeeId: string, year: number, tenantId: string) {
    const defaults = [
      { type: 'vacation' as any, totalDays: 21 },
      { type: 'sick' as any, totalDays: 10 },
      { type: 'emergency' as any, totalDays: 3 },
    ];

    const balances = defaults.map((d) =>
      this.balanceRepo.create({
        employeeId, year, tenantId,
        type: d.type,
        totalDays: d.totalDays,
        usedDays: 0,
        remainingDays: d.totalDays,
      }),
    );

    return this.balanceRepo.save(balances);
  }
}
