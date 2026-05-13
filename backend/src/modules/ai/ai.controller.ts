import {
  Controller, Post, Body, UseGuards, Sse, MessageEvent, Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { User } from '../auth/entities/user.entity';
import {
  AiChatDto, AiResumeAnalysisDto, AiReportDto, AiForecastDto,
} from './dto/ai.dto';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('hr/chat')
  @ApiOperation({ summary: 'HR AI Assistant chat' })
  hrChat(
    @Body() dto: AiChatDto,
    @CurrentUser() user: User,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.hrAssistant(dto.message, dto.context || {}, tenantId)
      .then((response) => ({ data: { response } }));
  }

  @Post('sales/chat')
  @ApiOperation({ summary: 'Sales AI Assistant chat' })
  salesChat(
    @Body() dto: AiChatDto,
    @CurrentUser() user: User,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.salesAssistant(dto.message, dto.context || {}, tenantId)
      .then((response) => ({ data: { response } }));
  }

  @Post('finance/chat')
  @ApiOperation({ summary: 'Finance AI Assistant chat' })
  financeChat(
    @Body() dto: AiChatDto,
    @CurrentUser() user: User,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.financeAssistant(dto.message, dto.context || {}, tenantId)
      .then((response) => ({ data: { response } }));
  }

  @Post('analytics/chat')
  @ApiOperation({ summary: 'Analytics AI Assistant chat' })
  analyticsChat(
    @Body() dto: AiChatDto,
    @CurrentUser() user: User,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.analyticsAssistant(dto.message, dto.context || {}, tenantId)
      .then((response) => ({ data: { response } }));
  }

  @Post('resume/analyze')
  @ApiOperation({ summary: 'AI Resume/CV Analysis' })
  analyzeResume(@Body() dto: AiResumeAnalysisDto) {
    return this.aiService.analyzeResume(dto.cvText, dto.vacancyDescription)
      .then((result) => ({ data: result }));
  }

  @Post('sales/forecast')
  @ApiOperation({ summary: 'AI Sales Forecast' })
  salesForecast(
    @Body() dto: AiForecastDto,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.generateSalesForecast(tenantId, dto.months)
      .then((result) => ({ data: result }));
  }

  @Post('employee/performance/:id')
  @ApiOperation({ summary: 'AI Employee Performance Analysis' })
  employeePerformance(
    @Body('employeeId') employeeId: string,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.analyzeEmployeePerformance(employeeId, tenantId)
      .then((result) => ({ data: result }));
  }

  @Post('report/generate')
  @ApiOperation({ summary: 'AI Auto Report Generation' })
  generateReport(
    @Body() dto: AiReportDto,
    @TenantId() tenantId: string,
  ) {
    return this.aiService.generateReport(dto.reportType, dto.data, tenantId)
      .then((report) => ({ data: { report } }));
  }

  @Post('chat/stream')
  @ApiOperation({ summary: 'AI Streaming Chat (SSE)' })
  async streamChat(
    @Body() dto: AiChatDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = [
      { role: 'user' as const, content: dto.message },
    ];

    for await (const chunk of this.aiService.streamChat(messages)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
