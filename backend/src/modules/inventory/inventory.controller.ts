import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateProductDto, UpdateProductDto, StockMovementDto } from './dto/inventory.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  create(@Body() dto: CreateProductDto, @TenantId() tenantId: string) {
    return this.inventoryService.createProduct(dto, tenantId);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.inventoryService.findAll(query, tenantId);
  }

  @Get('products/stats')
  @ApiOperation({ summary: 'Inventory statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.inventoryService.getStats(tenantId);
  }

  @Get('products/low-stock')
  @ApiOperation({ summary: 'Low stock alerts' })
  getLowStock(@TenantId() tenantId: string) {
    return this.inventoryService.getLowStockAlerts(tenantId);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.inventoryService.findOne(id, tenantId);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @TenantId() tenantId: string) {
    return this.inventoryService.update(id, dto, tenantId);
  }

  @Patch('products/:id/stock')
  @ApiOperation({ summary: 'Adjust stock (in/out/adjustment)' })
  adjustStock(@Param('id') id: string, @Body() dto: StockMovementDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.inventoryService.adjustStock(id, dto, tenantId, user.id);
  }
}
