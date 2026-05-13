import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/payroll.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'payroll', version: '1' })
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Generate payroll for employee' })
  generate(@Body() dto: CreatePayrollDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.payrollService.generate(dto, tenantId, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payrolls' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.payrollService.findAll(query, tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Monthly payroll statistics' })
  getStats(@TenantId() tenantId: string, @Query('year') year: number, @Query('month') month: number) {
    return this.payrollService.getMonthlyStats(year, month, tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.payrollService.findOne(id, tenantId);
  }

  @Patch(':id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Approve payroll' })
  approve(@Param('id') id: string, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.payrollService.approve(id, tenantId, user.id);
  }

  @Patch(':id/paid')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Mark payroll as paid' })
  markPaid(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: string,
    @TenantId() tenantId: string,
  ) {
    return this.payrollService.markPaid(id, tenantId, paymentMethod);
  }
}
