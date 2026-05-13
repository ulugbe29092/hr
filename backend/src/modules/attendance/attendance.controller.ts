import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto, AttendanceFilterDto } from './dto/attendance.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'attendance', version: '1' })
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin')
  @ApiOperation({ summary: 'Employee check-in (QR/GPS/Face ID)' })
  checkIn(@Body() dto: CheckInDto, @TenantId() tenantId: string) {
    return this.attendanceService.checkIn(dto, tenantId);
  }

  @Patch(':id/checkout')
  @ApiOperation({ summary: 'Employee check-out' })
  checkOut(@Param('id') id: string, @Body() dto: CheckOutDto, @TenantId() tenantId: string) {
    return this.attendanceService.checkOut(id, dto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get attendance records' })
  findAll(@Query() query: PaginationDto & AttendanceFilterDto, @TenantId() tenantId: string) {
    return this.attendanceService.findAll(query, tenantId);
  }

  @Get('today')
  @ApiOperation({ summary: "Today's attendance stats" })
  getTodayStats(@TenantId() tenantId: string) {
    return this.attendanceService.getTodayStats(tenantId);
  }

  @Get('report/:employeeId')
  @ApiOperation({ summary: 'Monthly attendance report for employee' })
  getMonthlyReport(
    @Param('employeeId') employeeId: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @TenantId() tenantId: string,
  ) {
    return this.attendanceService.getMonthlyReport(employeeId, year, month, tenantId);
  }
}
