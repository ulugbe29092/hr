import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { CreateVacancyDto, CreateCandidateDto, MoveCandidateDto } from './dto/recruitment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { User } from '../auth/entities/user.entity';
import { VacancyStatus } from './entities/vacancy.entity';

@ApiTags('Recruitment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'recruitment', version: '1' })
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post('vacancies')
  @Roles(UserRole.SUPER_ADMIN, UserRole.CEO, UserRole.HR, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Create vacancy' })
  createVacancy(@Body() dto: CreateVacancyDto, @TenantId() tenantId: string, @CurrentUser() user: User) {
    return this.recruitmentService.createVacancy(dto, tenantId, user.id);
  }

  @Get('vacancies')
  @ApiOperation({ summary: 'Get all vacancies' })
  findVacancies(@Query() query: PaginationDto, @TenantId() tenantId: string) {
    return this.recruitmentService.findAllVacancies(query, tenantId);
  }

  @Get('vacancies/stats')
  @ApiOperation({ summary: 'Recruitment statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.recruitmentService.getStats(tenantId);
  }

  @Get('vacancies/:id')
  @ApiOperation({ summary: 'Get vacancy by ID' })
  findVacancy(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.recruitmentService.findOneVacancy(id, tenantId);
  }

  @Patch('vacancies/:id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Update vacancy status' })
  updateStatus(@Param('id') id: string, @Body('status') status: VacancyStatus, @TenantId() tenantId: string) {
    return this.recruitmentService.updateVacancyStatus(id, status, tenantId);
  }

  @Post('candidates')
  @ApiOperation({ summary: 'Add candidate application' })
  addCandidate(@Body() dto: CreateCandidateDto, @TenantId() tenantId: string) {
    return this.recruitmentService.addCandidate(dto, tenantId);
  }

  @Get('vacancies/:vacancyId/candidates')
  @ApiOperation({ summary: 'Get candidates for vacancy' })
  findCandidates(@Param('vacancyId') vacancyId: string, @TenantId() tenantId: string) {
    return this.recruitmentService.findCandidates(vacancyId, tenantId);
  }

  @Get('vacancies/:vacancyId/kanban')
  @ApiOperation({ summary: 'Get candidate Kanban board' })
  getKanban(@Param('vacancyId') vacancyId: string, @TenantId() tenantId: string) {
    return this.recruitmentService.getCandidateKanban(vacancyId, tenantId);
  }

  @Patch('candidates/:id/move')
  @ApiOperation({ summary: 'Move candidate in pipeline' })
  moveCandidate(@Param('id') id: string, @Body() dto: MoveCandidateDto, @TenantId() tenantId: string) {
    return this.recruitmentService.moveCandidate(id, dto, tenantId);
  }
}
