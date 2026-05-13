import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, MoveSaleDto } from './dto/sale.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'sales', version: '1' })
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create sale/deal' })
  create(@Body() dto: CreateSaleDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.salesService.create(dto, tenantId, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.salesService.findAll(query, tenantId);
  }

  @Get('kanban')
  @ApiOperation({ summary: 'Get Kanban board view' })
  getKanban(@TenantId() tenantId: string) {
    return this.salesService.getKanbanBoard(tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get pipeline statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.salesService.getPipelineStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.salesService.findOne(id, tenantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sale' })
  update(@Param('id') id: string, @Body() dto: UpdateSaleDto, @TenantId() tenantId: string) {
    return this.salesService.update(id, dto, tenantId);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move sale in Kanban (drag & drop)' })
  move(@Param('id') id: string, @Body() dto: MoveSaleDto, @TenantId() tenantId: string) {
    return this.salesService.moveSale(id, dto, tenantId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.SALES_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete sale' })
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.salesService.remove(id, tenantId);
  }
}
