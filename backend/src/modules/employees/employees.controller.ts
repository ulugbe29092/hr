import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR)
  @ApiOperation({ summary: 'Create employee' })
  create(
    @Body() dto: CreateEmployeeDto,
    @TenantId() tenantId: string,
    @CurrentUser() user: User,
  ) {
    return this.employeesService.create(dto, tenantId, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees with pagination' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.employeesService.findAll(query, tenantId);
  }

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR)
  @ApiOperation({ summary: 'Get employee statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.employeesService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.employeesService.findOne(id, tenantId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR)
  @ApiOperation({ summary: 'Update employee' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @TenantId() tenantId: string,
    @CurrentUser() user: User,
  ) {
    return this.employeesService.update(id, dto, tenantId, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete employee (soft delete)' })
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @CurrentUser() user: User,
  ) {
    return this.employeesService.remove(id, tenantId, user.id);
  }
}
