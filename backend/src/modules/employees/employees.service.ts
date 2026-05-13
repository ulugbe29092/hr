import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { Employee } from './entities/employee.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateEmployeeDto, tenantId: string, createdBy: string) {
    const existing = await this.employeeRepository.findOne({
      where: { email: dto.email, tenantId },
    });
    if (existing) throw new ConflictException('Employee with this email already exists');

    const code = await this.generateEmployeeCode(tenantId);
    const employee = this.employeeRepository.create({
      ...dto,
      employeeCode: code,
      tenantId,
    });

    const saved = await this.employeeRepository.save(employee);
    this.eventEmitter.emit('employee.created', { employee: saved, createdBy });
    return saved;
  }

  async findAll(query: PaginationDto, tenantId: string) {
    const where: FindOptionsWhere<Employee> = { tenantId };
    if (query.search) {
      return this.searchEmployees(query, tenantId);
    }

    const [data, total] = await this.employeeRepository.findAndCount({
      where,
      order: { [query.sortBy || 'createdAt']: query.sortOrder || 'DESC' },
      take: query.limit,
      skip: query.skip,
    });

    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  private async searchEmployees(query: PaginationDto, tenantId: string) {
    const qb = this.employeeRepository
      .createQueryBuilder('e')
      .where('e.tenant_id = :tenantId', { tenantId })
      .andWhere(
        '(e.first_name ILIKE :search OR e.last_name ILIKE :search OR e.email ILIKE :search OR e.employee_code ILIKE :search OR e.job_title ILIKE :search)',
        { search: `%${query.search}%` },
      )
      .orderBy(`e.${query.sortBy || 'created_at'}`, query.sortOrder || 'DESC')
      .take(query.limit)
      .skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOne(id: string, tenantId: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id, tenantId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto, tenantId: string, updatedBy: string) {
    const employee = await this.findOne(id, tenantId);
    const updated = await this.employeeRepository.save({
      ...employee,
      ...dto,
    });
    this.eventEmitter.emit('employee.updated', { employee: updated, updatedBy });
    return updated;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const employee = await this.findOne(id, tenantId);
    await this.employeeRepository.softDelete(id);
    this.eventEmitter.emit('employee.deleted', { employee, deletedBy });
    return { message: 'Employee deleted successfully' };
  }

  async getStats(tenantId: string) {
    const qb = this.employeeRepository
      .createQueryBuilder('e')
      .where('e.tenant_id = :tenantId', { tenantId })
      .andWhere('e.deleted_at IS NULL');

    const [total, active, byDepartment, byEmploymentType] = await Promise.all([
      qb.getCount(),
      qb.clone().andWhere("e.status = 'active'").getCount(),
      qb.clone()
        .select('e.department_id', 'departmentId')
        .addSelect('COUNT(*)', 'count')
        .groupBy('e.department_id')
        .getRawMany(),
      qb.clone()
        .select('e.employment_type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('e.employment_type')
        .getRawMany(),
    ]);

    return { total, active, inactive: total - active, byDepartment, byEmploymentType };
  }

  private async generateEmployeeCode(tenantId: string): Promise<string> {
    const count = await this.employeeRepository.count({ where: { tenantId } });
    return `EMP-${String(count + 1).padStart(4, '0')}`;
  }
}
