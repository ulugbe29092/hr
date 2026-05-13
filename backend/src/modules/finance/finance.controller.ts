import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateTransactionDto, UpdateTransactionDto, FinanceFilterDto } from './dto/finance.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'finance', version: '1' })
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('transactions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Create transaction' })
  create(@Body() dto: CreateTransactionDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.financeService.create(dto, tenantId, user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  findAll(@Query() query: PaginationDto & FinanceFilterDto, @TenantId() tenantId: string) {
    return this.financeService.findAll(query, tenantId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Finance dashboard stats' })
  getDashboard(@TenantId() tenantId: string, @Query('year') year?: number, @Query('month') month?: number) {
    return this.financeService.getDashboardStats(tenantId, year, month);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Monthly income/expense trend' })
  getTrend(@TenantId() tenantId: string, @Query('months') months?: number) {
    return this.financeService.getMonthlyTrend(tenantId, months);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.financeService.findOne(id, tenantId);
  }

  @Put('transactions/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Update transaction' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto, @TenantId() tenantId: string) {
    return this.financeService.update(id, dto, tenantId);
  }

  @Delete('transactions/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.financeService.remove(id, tenantId);
  }
}
