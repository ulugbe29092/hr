import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Dashboard overview stats' })
  getOverview(@TenantId() tenantId: string) {
    return this.analyticsService.getDashboardOverview(tenantId);
  }

  @Get('kpi')
  @ApiOperation({ summary: 'KPI metrics with growth rates' })
  getKpi(@TenantId() tenantId: string) {
    return this.analyticsService.getKpiMetrics(tenantId);
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Realtime stats snapshot' })
  getRealtime(@TenantId() tenantId: string) {
    return this.analyticsService.getRealtimeStats(tenantId);
  }
}
