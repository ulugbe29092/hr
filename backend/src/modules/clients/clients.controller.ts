import {
  Controller, Get, Post, Put, Delete, Body,
  Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'clients', version: '1' })
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Create client' })
  create(@Body() dto: CreateClientDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.clientsService.create(dto, tenantId, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.clientsService.findAll(query, tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get client statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.clientsService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.clientsService.findOne(id, tenantId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Update client' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.clientsService.update(id, dto, tenantId, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.SALES_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.clientsService.remove(id, tenantId, user.id);
  }
}
