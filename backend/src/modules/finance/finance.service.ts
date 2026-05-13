import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateTransactionDto, UpdateTransactionDto, FinanceFilterDto } from './dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTransactionDto, tenantId: string, createdBy: string) {
    const transaction = this.transactionRepository.create({
      ...dto,
      tenantId,
      createdBy,
    });
    const saved = await this.transactionRepository.save(transaction);
    this.eventEmitter.emit('finance.transaction.created', { transaction: saved });
    return saved;
  }

  async findAll(query: PaginationDto & FinanceFilterDto, tenantId: string) {
    const qb = this.transactionRepository
      .createQueryBuilder('t')
      .where('t.tenant_id = :tenantId', { tenantId })
      .andWhere('t.deleted_at IS NULL');

    if (query.type) qb.andWhere('t.type = :type', { type: query.type });
    if (query.category) qb.andWhere('t.category = :category', { category: query.category });
    if (query.startDate) qb.andWhere('t.date >= :startDate', { startDate: query.startDate });
    if (query.endDate) qb.andWhere('t.date <= :endDate', { endDate: query.endDate });
    if (query.search) {
      qb.andWhere('(t.title ILIKE :s OR t.description ILIKE :s)', { s: `%${query.search}%` });
    }

    qb.orderBy('t.date', 'DESC').take(query.limit).skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const t = await this.transactionRepository.findOne({ where: { id, tenantId } });
    if (!t) throw new NotFoundException('Transaction not found');
    return t;
  }

  async update(id: string, dto: UpdateTransactionDto, tenantId: string) {
    const t = await this.findOne(id, tenantId);
    return this.transactionRepository.save({ ...t, ...dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.transactionRepository.softDelete(id);
    return { message: 'Transaction deleted' };
  }

  async getDashboardStats(tenantId: string, year?: number, month?: number) {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const qb = this.transactionRepository
      .createQueryBuilder('t')
      .where('t.tenant_id = :tenantId', { tenantId })
      .andWhere('t.deleted_at IS NULL')
      .andWhere("t.status = 'completed'");

    const [totalIncome, totalExpense, monthlyIncome, monthlyExpense, byCategory] =
      await Promise.all([
        qb.clone()
          .andWhere("t.type = 'income'")
          .select('SUM(t.amount)', 'total')
          .getRawOne(),
        qb.clone()
          .andWhere("t.type = 'expense'")
          .select('SUM(t.amount)', 'total')
          .getRawOne(),
        qb.clone()
          .andWhere("t.type = 'income'")
          .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: currentYear })
          .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: currentMonth })
          .select('SUM(t.amount)', 'total')
          .getRawOne(),
        qb.clone()
          .andWhere("t.type = 'expense'")
          .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: currentYear })
          .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: currentMonth })
          .select('SUM(t.amount)', 'total')
          .getRawOne(),
        qb.clone()
          .select('t.category', 'category')
          .addSelect('t.type', 'type')
          .addSelect('SUM(t.amount)', 'total')
          .groupBy('t.category, t.type')
          .getRawMany(),
      ]);

    const income = parseFloat(totalIncome?.total || '0');
    const expense = parseFloat(totalExpense?.total || '0');

    return {
      totalIncome: income,
      totalExpense: expense,
      netProfit: income - expense,
      monthlyIncome: parseFloat(monthlyIncome?.total || '0'),
      monthlyExpense: parseFloat(monthlyExpense?.total || '0'),
      byCategory,
    };
  }

  async getMonthlyTrend(tenantId: string, months: number = 12) {
    const qb = this.transactionRepository
      .createQueryBuilder('t')
      .where('t.tenant_id = :tenantId', { tenantId })
      .andWhere('t.deleted_at IS NULL')
      .andWhere("t.status = 'completed'")
      .andWhere(`t.date >= NOW() - INTERVAL '${months} months'`)
      .select("TO_CHAR(t.date, 'YYYY-MM')", 'month')
      .addSelect('t.type', 'type')
      .addSelect('SUM(t.amount)', 'total')
      .groupBy("TO_CHAR(t.date, 'YYYY-MM'), t.type")
      .orderBy("TO_CHAR(t.date, 'YYYY-MM')", 'ASC');

    return qb.getRawMany();
  }
}
