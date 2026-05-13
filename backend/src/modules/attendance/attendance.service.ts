import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Attendance } from './entities/attendance.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CheckInDto, CheckOutDto, AttendanceFilterDto } from './dto/attendance.dto';
import { AttendanceMethod } from '../../common/enums/status.enum';

@Injectable()
export class AttendanceService {
  private readonly WORK_START_HOUR = 9; // 09:00

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkIn(dto: CheckInDto, tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.attendanceRepo.findOne({
      where: { employeeId: dto.employeeId, tenantId },
    });
    if (existing?.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    const now = new Date();
    const isLate = now.getHours() > this.WORK_START_HOUR ||
      (now.getHours() === this.WORK_START_HOUR && now.getMinutes() > 15);
    const lateMinutes = isLate
      ? (now.getHours() - this.WORK_START_HOUR) * 60 + now.getMinutes()
      : 0;

    const attendance = this.attendanceRepo.create({
      employeeId: dto.employeeId,
      date: today,
      checkIn: now,
      method: dto.method || AttendanceMethod.MANUAL,
      location: dto.location,
      qrCode: dto.qrCode,
      faceIdVerified: dto.faceIdVerified || false,
      isLate,
      lateMinutes,
      tenantId,
    });

    const saved = await this.attendanceRepo.save(attendance);
    this.eventEmitter.emit('attendance.checkin', { attendance: saved });
    return saved;
  }

  async checkOut(id: string, dto: CheckOutDto, tenantId: string) {
    const attendance = await this.attendanceRepo.findOne({ where: { id, tenantId } });
    if (!attendance) throw new NotFoundException('Attendance record not found');
    if (!attendance.checkIn) throw new BadRequestException('Not checked in');
    if (attendance.checkOut) throw new BadRequestException('Already checked out');

    const now = new Date();
    const diffMs = now.getTime() - attendance.checkIn.getTime();
    const workHours = Math.round((diffMs / 3600000) * 100) / 100;
    const standardHours = 8;
    const overtimeHours = Math.max(0, workHours - standardHours);

    attendance.checkOut = now;
    attendance.workHours = workHours;
    attendance.overtimeHours = overtimeHours;
    attendance.notes = dto.notes;

    const saved = await this.attendanceRepo.save(attendance);
    this.eventEmitter.emit('attendance.checkout', { attendance: saved });
    return saved;
  }

  async findAll(query: PaginationDto & AttendanceFilterDto, tenantId: string) {
    const qb = this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.tenant_id = :tenantId', { tenantId });

    if (query.employeeId) qb.andWhere('a.employee_id = :eid', { eid: query.employeeId });
    if (query.startDate) qb.andWhere('a.date >= :start', { start: query.startDate });
    if (query.endDate) qb.andWhere('a.date <= :end', { end: query.endDate });

    qb.orderBy('a.date', 'DESC').take(query.limit).skip(query.skip);
    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async getMonthlyReport(employeeId: string, year: number, month: number, tenantId: string) {
    const records = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.tenant_id = :tenantId', { tenantId })
      .andWhere('a.employee_id = :employeeId', { employeeId })
      .andWhere('EXTRACT(YEAR FROM a.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM a.date) = :month', { month })
      .getMany();

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.checkIn).length;
    const lateDays = records.filter((r) => r.isLate).length;
    const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const totalOvertimeHours = records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);

    return {
      employeeId, year, month,
      totalDays, presentDays, lateDays,
      absentDays: totalDays - presentDays,
      totalWorkHours: Math.round(totalWorkHours * 100) / 100,
      totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
      records,
    };
  }

  async getTodayStats(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [checkedIn, late, checkedOut] = await Promise.all([
      this.attendanceRepo.createQueryBuilder('a')
        .where('a.tenant_id = :tenantId', { tenantId })
        .andWhere('DATE(a.date) = CURRENT_DATE')
        .andWhere('a.check_in IS NOT NULL')
        .getCount(),
      this.attendanceRepo.createQueryBuilder('a')
        .where('a.tenant_id = :tenantId', { tenantId })
        .andWhere('DATE(a.date) = CURRENT_DATE')
        .andWhere('a.is_late = true')
        .getCount(),
      this.attendanceRepo.createQueryBuilder('a')
        .where('a.tenant_id = :tenantId', { tenantId })
        .andWhere('DATE(a.date) = CURRENT_DATE')
        .andWhere('a.check_out IS NOT NULL')
        .getCount(),
    ]);

    return { checkedIn, late, checkedOut, date: new Date() };
  }
}
