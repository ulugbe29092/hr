import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Transaction } from '../finance/entities/transaction.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
  ) {}

  async getDashboardOverview(tenantId: string) {
    const [employees, activeSales, monthlyRevenue, attendanceToday] = await Promise.all([
      this.employeeRepo.count({ where: { tenantId } }),
      this.saleRepo
        .createQueryBuilder('s')
        .where('s.tenant_id = :tenantId', { tenantId })
        .andWhere("s.status NOT IN ('won', 'lost')")
        .getCount(),
      this.transactionRepo
        .createQueryBuilder('t')
        .where('t.tenant_id = :tenantId', { tenantId })
        .andWhere("t.type = 'income'")
        .andWhere("t.status = 'completed'")
        .andWhere('EXTRACT(MONTH FROM t.date) = EXTRACT(MONTH FROM NOW())')
        .andWhere('EXTRACT(YEAR FROM t.date) = EXTRACT(YEAR FROM NOW())')
        .select('SUM(t.amount)', 'total')
        .getRawOne(),
      this.attendanceRepo
        .createQueryBuilder('a')
        .where('a.tenant_id = :tenantId', { tenantId })
        .andWhere('DATE(a.date) = CURRENT_DATE')
        .andWhere('a.check_in IS NOT NULL')
        .getCount(),
    ]);

    return {
      totalEmployees: employees,
      activeSalesDeals: activeSales,
      monthlyRevenue: parseFloat(monthlyRevenue?.total || '0'),
      attendanceToday,
    };
  }

  async getKpiMetrics(tenantId: string) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentRevenue, lastRevenue, wonDeals, totalDeals] = await Promise.all([
      this.transactionRepo
        .createQueryBuilder('t')
        .where('t.tenant_id = :tenantId', { tenantId })
        .andWhere("t.type = 'income'")
        .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: now.getMonth() + 1 })
        .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: now.getFullYear() })
        .select('SUM(t.amount)', 'total')
        .getRawOne(),
      this.transactionRepo
        .createQueryBuilder('t')
        .where('t.tenant_id = :tenantId', { tenantId })
        .andWhere("t.type = 'income'")
        .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: lastMonth.getMonth() + 1 })
        .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: lastMonth.getFullYear() })
        .select('SUM(t.amount)', 'total')
        .getRawOne(),
      this.saleRepo.count({ where: { tenantId, status: 'won' as any } }),
      this.saleRepo.count({ where: { tenantId } }),
    ]);

    const curr = parseFloat(currentRevenue?.total || '0');
    const last = parseFloat(lastRevenue?.total || '0');
    const revenueGrowth = last > 0 ? ((curr - last) / last) * 100 : 0;
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    return {
      currentMonthRevenue: curr,
      lastMonthRevenue: last,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      winRate: Math.round(winRate * 100) / 100,
      wonDeals,
      totalDeals,
    };
  }

  async getRealtimeStats(tenantId: string) {
    const [overview, kpis] = await Promise.all([
      this.getDashboardOverview(tenantId),
      this.getKpiMetrics(tenantId),
    ]);
    return { ...overview, ...kpis, timestamp: new Date() };
  }
}
