import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payroll, PayrollStatus } from './entities/payroll.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreatePayrollDto, UpdatePayrollDto } from './dto/payroll.dto';

@Injectable()
export class PayrollService {
  private readonly TAX_RATE = 0.12;
  private readonly SOCIAL_SECURITY_RATE = 0.08;

  constructor(
    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,
    private eventEmitter: EventEmitter2,
  ) {}

  async generate(dto: CreatePayrollDto, tenantId: string, createdBy: string) {
    const existing = await this.payrollRepo.findOne({
      where: { employeeId: dto.employeeId, month: dto.month, year: dto.year, tenantId },
    });
    if (existing) throw new BadRequestException('Payroll already exists for this period');

    const grossSalary = dto.baseSalary + (dto.overtimePay || 0) + (dto.bonus || 0) + (dto.allowances || 0);
    const taxAmount = grossSalary * this.TAX_RATE;
    const socialSecurity = grossSalary * this.SOCIAL_SECURITY_RATE;
    const totalDeductions = (dto.deductions || 0) + (dto.fines || 0) + taxAmount + socialSecurity;
    const netSalary = grossSalary - totalDeductions;

    const payroll = this.payrollRepo.create({
      ...dto,
      tenantId,
      grossSalary,
      taxAmount,
      socialSecurity,
      netSalary,
      status: PayrollStatus.DRAFT,
      breakdown: {
        baseSalary: dto.baseSalary,
        overtimePay: dto.overtimePay || 0,
        bonus: dto.bonus || 0,
        allowances: dto.allowances || 0,
        deductions: dto.deductions || 0,
        fines: dto.fines || 0,
        taxAmount,
        socialSecurity,
      },
    });

    const saved = await this.payrollRepo.save(payroll);
    this.eventEmitter.emit('payroll.generated', { payroll: saved, createdBy });
    return saved;
  }

  async approve(id: string, tenantId: string, approvedBy: string) {
    const payroll = await this.findOne(id, tenantId);
    if (payroll.status !== PayrollStatus.PENDING)
      throw new BadRequestException('Payroll must be in PENDING status to approve');

    payroll.status = PayrollStatus.APPROVED;
    payroll.approvedBy = approvedBy;
    const saved = await this.payrollRepo.save(payroll);
    this.eventEmitter.emit('payroll.approved', { payroll: saved });
    return saved;
  }

  async markPaid(id: string, tenantId: string, paymentMethod: string) {
    const payroll = await this.findOne(id, tenantId);
    if (payroll.status !== PayrollStatus.APPROVED)
      throw new BadRequestException('Payroll must be approved before marking as paid');

    payroll.status = PayrollStatus.PAID;
    payroll.paymentDate = new Date();
    payroll.paymentMethod = paymentMethod;
    const saved = await this.payrollRepo.save(payroll);
    this.eventEmitter.emit('payroll.paid', { payroll: saved });
    return saved;
  }

  async findAll(query: PaginationDto, tenantId: string) {
    const qb = this.payrollRepo
      .createQueryBuilder('p')
      .where('p.tenant_id = :tenantId', { tenantId })
      .orderBy('p.year', 'DESC')
      .addOrderBy('p.month', 'DESC')
      .take(query.limit)
      .skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const p = await this.payrollRepo.findOne({ where: { id, tenantId } });
    if (!p) throw new NotFoundException('Payroll not found');
    return p;
  }

  async getMonthlyStats(year: number, month: number, tenantId: string) {
    const qb = this.payrollRepo
      .createQueryBuilder('p')
      .where('p.tenant_id = :tenantId', { tenantId })
      .andWhere('p.year = :year', { year })
      .andWhere('p.month = :month', { month });

    const [count, totals] = await Promise.all([
      qb.getCount(),
      qb.clone()
        .select('SUM(p.net_salary)', 'totalNet')
        .addSelect('SUM(p.gross_salary)', 'totalGross')
        .addSelect('SUM(p.tax_amount)', 'totalTax')
        .addSelect('SUM(p.bonus)', 'totalBonus')
        .getRawOne(),
    ]);

    return {
      year, month, count,
      totalNetSalary: parseFloat(totals?.totalNet || '0'),
      totalGrossSalary: parseFloat(totals?.totalGross || '0'),
      totalTax: parseFloat(totals?.totalTax || '0'),
      totalBonus: parseFloat(totals?.totalBonus || '0'),
    };
  }
}
