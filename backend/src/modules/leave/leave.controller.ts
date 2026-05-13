import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { CreateLeaveDto, ApproveLeaveDto } from './dto/leave.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@ApiTags('Leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'leave', version: '1' })
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('request')
  @ApiOperation({ summary: 'Submit leave request' })
  request(@Body() dto: CreateLeaveDto, @TenantId() tenantId: string) {
    return this.leaveService.request(dto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get leave requests' })
  findAll(@Query() query: PaginationDto, @TenantId() tenantId: string, @Query('employeeId') employeeId?: string) {
    return this.leaveService.findAll(query, tenantId, employeeId);
  }

  @Get('balance/:employeeId')
  @ApiOperation({ summary: 'Get leave balance for employee' })
  getBalance(@Param('employeeId') employeeId: string, @Query('year') year: number, @TenantId() tenantId: string) {
    return this.leaveService.getBalance(employeeId, year || new Date().getFullYear(), tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave request by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.leaveService.findOne(id, tenantId);
  }

  @Patch(':id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR)
  @ApiOperation({ summary: 'Approve or reject leave request' })
  approve(@Param('id') id: string, @Body() dto: ApproveLeaveDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.leaveService.approve(id, dto, tenantId, user.id);
  }

  @Post('balance/init/:employeeId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Initialize leave balance for employee' })
  initBalance(@Param('employeeId') employeeId: string, @Query('year') year: number, @TenantId() tenantId: string) {
    return this.leaveService.initBalance(employeeId, year || new Date().getFullYear(), tenantId);
  }
}
