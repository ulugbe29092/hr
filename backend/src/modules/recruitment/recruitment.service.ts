import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Vacancy, Candidate, CandidateStatus, VacancyStatus } from './entities/vacancy.entity';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { CreateVacancyDto, CreateCandidateDto, MoveCandidateDto } from './dto/recruitment.dto';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Vacancy) private vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Candidate) private candidateRepo: Repository<Candidate>,
    private eventEmitter: EventEmitter2,
  ) {}

  // ─── Vacancies ────────────────────────────────────────────────────────────────
  async createVacancy(dto: CreateVacancyDto, tenantId: string, createdBy: string) {
    const vacancy = this.vacancyRepo.create({ ...dto, tenantId, createdBy });
    const saved = await this.vacancyRepo.save(vacancy);
    this.eventEmitter.emit('vacancy.created', { vacancy: saved });
    return saved;
  }

  async findAllVacancies(query: PaginationDto, tenantId: string) {
    const qb = this.vacancyRepo
      .createQueryBuilder('v')
      .where('v.tenant_id = :tenantId', { tenantId })
      .andWhere('v.deleted_at IS NULL');

    if (query.search) qb.andWhere('v.title ILIKE :s', { s: `%${query.search}%` });
    qb.orderBy('v.created_at', 'DESC').take(query.limit).skip(query.skip);

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, query.page ?? 1, query.limit ?? 20);
  }

  async findOneVacancy(id: string, tenantId: string) {
    const v = await this.vacancyRepo.findOne({ where: { id, tenantId } });
    if (!v) throw new NotFoundException('Vacancy not found');
    return v;
  }

  async updateVacancyStatus(id: string, status: VacancyStatus, tenantId: string) {
    const v = await this.findOneVacancy(id, tenantId);
    v.status = status;
    return this.vacancyRepo.save(v);
  }

  // ─── Candidates ───────────────────────────────────────────────────────────────
  async addCandidate(dto: CreateCandidateDto, tenantId: string) {
    const candidate = this.candidateRepo.create({ ...dto, tenantId });
    const saved = await this.candidateRepo.save(candidate);
    this.eventEmitter.emit('candidate.applied', { candidate: saved });
    return saved;
  }

  async findCandidates(vacancyId: string, tenantId: string) {
    return this.candidateRepo.find({
      where: { vacancyId, tenantId },
      order: { kanbanOrder: 'ASC' },
    });
  }

  async getCandidateKanban(vacancyId: string, tenantId: string) {
    const candidates = await this.findCandidates(vacancyId, tenantId);
    const board: Record<string, Candidate[]> = {};
    Object.values(CandidateStatus).forEach((s) => (board[s] = []));
    candidates.forEach((c) => board[c.status]?.push(c));
    return board;
  }

  async moveCandidate(id: string, dto: MoveCandidateDto, tenantId: string) {
    const candidate = await this.candidateRepo.findOne({ where: { id, tenantId } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    candidate.status = dto.status;
    candidate.kanbanOrder = dto.order ?? candidate.kanbanOrder;
    return this.candidateRepo.save(candidate);
  }

  async updateAiScore(id: string, aiAnalysis: any, tenantId: string) {
    const candidate = await this.candidateRepo.findOne({ where: { id, tenantId } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    candidate.aiScore = aiAnalysis.matchScore;
    candidate.aiAnalysis = aiAnalysis;
    return this.candidateRepo.save(candidate);
  }

  async getStats(tenantId: string) {
    const [totalVacancies, openVacancies, totalCandidates, hired] = await Promise.all([
      this.vacancyRepo.count({ where: { tenantId } }),
      this.vacancyRepo.count({ where: { tenantId, status: VacancyStatus.OPEN } }),
      this.candidateRepo.count({ where: { tenantId } }),
      this.candidateRepo.count({ where: { tenantId, status: CandidateStatus.HIRED } }),
    ]);
    return { totalVacancies, openVacancies, totalCandidates, hired };
  }
}
