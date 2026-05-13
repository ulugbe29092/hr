import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../../common/enums/status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(userId: string, title: string, message: string, type: NotificationType, tenantId: string, metadata?: any) {
    const notification = this.notificationRepo.create({
      userId, title, message, type, tenantId,
      metadata: metadata || {},
      sentVia: ['app'],
    });
    return this.notificationRepo.save(notification);
  }

  async findAll(userId: string, tenantId: string, unreadOnly = false) {
    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .andWhere('n.tenant_id = :tenantId', { tenantId })
      .orderBy('n.created_at', 'DESC')
      .take(50);

    if (unreadOnly) qb.andWhere('n.is_read = false');
    return qb.getMany();
  }

  async markRead(id: string, userId: string) {
    await this.notificationRepo.update(
      { id, userId },
      { isRead: true, readAt: new Date() },
    );
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string, tenantId: string) {
    await this.notificationRepo.update(
      { userId, tenantId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string, tenantId: string) {
    const count = await this.notificationRepo.count({
      where: { userId, tenantId, isRead: false },
    });
    return { count };
  }

  // ─── Event Listeners ──────────────────────────────────────────────────────────
  @OnEvent('employee.created')
  async onEmployeeCreated({ employee, createdBy }: any) {
    await this.create(
      createdBy,
      'New Employee Added',
      `${employee.firstName} ${employee.lastName} has been added to the system`,
      NotificationType.SUCCESS,
      employee.tenantId,
    );
  }

  @OnEvent('leave.requested')
  async onLeaveRequested({ leave }: any) {
    // Notify HR managers — simplified
    await this.create(
      leave.employeeId,
      'Leave Request Submitted',
      `Your leave request for ${leave.totalDays} days has been submitted`,
      NotificationType.INFO,
      leave.tenantId,
    );
  }

  @OnEvent('payroll.paid')
  async onPayrollPaid({ payroll }: any) {
    await this.create(
      payroll.employeeId,
      'Salary Paid',
      `Your salary of $${payroll.netSalary.toLocaleString()} has been processed`,
      NotificationType.SUCCESS,
      payroll.tenantId,
    );
  }

  @OnEvent('sale.moved')
  async onSaleMoved({ sale, oldStatus }: any) {
    if (sale.status === 'won') {
      await this.create(
        sale.assignedTo,
        'Deal Won! 🎉',
        `${sale.title} — $${sale.amount.toLocaleString()} deal has been won`,
        NotificationType.SUCCESS,
        sale.tenantId,
      );
    }
  }
}
