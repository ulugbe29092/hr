import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Transaction } from '../finance/entities/transaction.entity';
import { Candidate } from '../recruitment/entities/vacancy.entity';

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiAnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  score?: number;
  data?: Record<string, any>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  // ─── HR Assistant ─────────────────────────────────────────────────────────────
  async hrAssistant(message: string, context: any, tenantId: string): Promise<string> {
    const systemPrompt = `You are an expert HR assistant for NEXUS Platform.
You help HR managers with:
- Employee management and onboarding
- Performance reviews and KPI analysis
- Leave management and attendance tracking
- Payroll calculations and salary benchmarking
- Recruitment and talent acquisition
- HR policies and compliance

Current context: ${JSON.stringify(context)}
Tenant: ${tenantId}

Respond in a professional, concise manner. Provide actionable insights.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  }

  // ─── Sales Assistant ──────────────────────────────────────────────────────────
  async salesAssistant(message: string, context: any, tenantId: string): Promise<string> {
    const systemPrompt = `You are an expert CRM and Sales assistant for NEXUS Platform.
You help sales teams with:
- Lead qualification and scoring
- Sales pipeline optimization
- Customer relationship management
- Deal negotiation strategies
- Sales forecasting and analytics
- Communication templates

Current context: ${JSON.stringify(context)}

Respond with specific, actionable sales advice.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  }

  // ─── Finance Assistant ────────────────────────────────────────────────────────
  async financeAssistant(message: string, context: any, tenantId: string): Promise<string> {
    const systemPrompt = `You are an expert Finance assistant for NEXUS Platform.
You help finance teams with:
- Expense analysis and categorization
- Budget planning and forecasting
- Cash flow management
- Tax optimization strategies
- Financial reporting and KPIs
- Invoice and procurement management

Current context: ${JSON.stringify(context)}

Provide precise financial insights and recommendations.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  }

  // ─── Analytics Assistant ──────────────────────────────────────────────────────
  async analyticsAssistant(message: string, context: any, tenantId: string): Promise<string> {
    const systemPrompt = `You are an expert Business Analytics assistant for NEXUS Platform.
You analyze:
- KPI trends and anomalies
- Employee performance metrics
- Sales and revenue forecasting
- Customer behavior patterns
- Operational efficiency metrics
- Predictive analytics

Current context: ${JSON.stringify(context)}

Provide data-driven insights with clear visualizations recommendations.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  }

  // ─── CV / Resume Analysis ─────────────────────────────────────────────────────
  async analyzeResume(cvText: string, vacancyDescription: string): Promise<AiAnalysisResult> {
    const prompt = `Analyze this candidate's CV against the job requirements.

JOB REQUIREMENTS:
${vacancyDescription}

CANDIDATE CV:
${cvText}

Provide a structured analysis with:
1. Overall match score (0-100)
2. Key strengths (list)
3. Skill gaps (list)
4. Experience relevance
5. Recommendation (hire/consider/reject)
6. Extracted skills list

Respond in JSON format:
{
  "matchScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "skills": string[],
  "recommendation": "hire" | "consider" | "reject",
  "summary": string,
  "experienceYears": number
}`;

    const response = await this.chat([{ role: 'user', content: prompt }]);

    try {
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary,
        insights: parsed.strengths,
        recommendations: [parsed.recommendation],
        score: parsed.matchScore,
        data: parsed,
      };
    } catch {
      return {
        summary: response,
        insights: [],
        recommendations: [],
        score: 0,
      };
    }
  }

  // ─── Employee Performance Analysis ───────────────────────────────────────────
  async analyzeEmployeePerformance(employeeId: string, tenantId: string): Promise<AiAnalysisResult> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      return { summary: 'Employee not found', insights: [], recommendations: [] };
    }

    const prompt = `Analyze this employee's performance data and provide insights:

Employee: ${employee.firstName} ${employee.lastName}
Job Title: ${employee.jobTitle}
KPI Score: ${employee.kpiScore}
Skills: ${employee.skills?.join(', ')}
Employment Type: ${employee.employmentType}
Hire Date: ${employee.hireDate}

Provide:
1. Performance assessment
2. Key strengths
3. Areas for improvement
4. Career development recommendations
5. Training suggestions

Respond in JSON format with: summary, insights (array), recommendations (array), score (0-100)`;

    const response = await this.chat([{ role: 'user', content: prompt }]);

    try {
      return JSON.parse(response);
    } catch {
      return { summary: response, insights: [], recommendations: [], score: employee.kpiScore };
    }
  }

  // ─── Sales Forecast ───────────────────────────────────────────────────────────
  async generateSalesForecast(tenantId: string, months: number = 3): Promise<AiAnalysisResult> {
    const recentSales = await this.saleRepository
      .createQueryBuilder('s')
      .where('s.tenant_id = :tenantId', { tenantId })
      .orderBy('s.created_at', 'DESC')
      .take(50)
      .getMany();

    const salesData = recentSales.map((s) => ({
      amount: s.amount,
      status: s.status,
      probability: s.winProbability,
      date: s.createdAt,
    }));

    const prompt = `Based on this sales pipeline data, generate a ${months}-month sales forecast:

Sales Data: ${JSON.stringify(salesData)}

Provide:
1. Revenue forecast for next ${months} months
2. Pipeline health assessment
3. Win rate analysis
4. Key risks and opportunities
5. Recommended actions

Respond in JSON format with: summary, insights (array), recommendations (array), data (forecast object)`;

    const response = await this.chat([{ role: 'user', content: prompt }]);

    try {
      return JSON.parse(response);
    } catch {
      return { summary: response, insights: [], recommendations: [] };
    }
  }

  // ─── Auto Report Generation ───────────────────────────────────────────────────
  async generateReport(reportType: string, data: any, tenantId: string): Promise<string> {
    const prompt = `Generate a professional ${reportType} report for NEXUS Platform.

Data: ${JSON.stringify(data)}

Create a comprehensive report with:
- Executive Summary
- Key Metrics and KPIs
- Trend Analysis
- Insights and Findings
- Recommendations
- Action Items

Format as a professional business report.`;

    return this.chat([{ role: 'user', content: prompt }]);
  }

  // ─── Smart Notifications ──────────────────────────────────────────────────────
  async generateSmartNotification(event: string, data: any): Promise<{ title: string; message: string }> {
    const prompt = `Generate a concise, professional notification for this event:

Event: ${event}
Data: ${JSON.stringify(data)}

Respond in JSON: { "title": "short title", "message": "detailed message" }`;

    const response = await this.chat([{ role: 'user', content: prompt }]);

    try {
      return JSON.parse(response);
    } catch {
      return { title: event, message: response };
    }
  }

  // ─── Core Chat ────────────────────────────────────────────────────────────────
  async chat(messages: AiChatMessage[]): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview'),
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  // ─── Streaming Chat ───────────────────────────────────────────────────────────
  async *streamChat(messages: AiChatMessage[]): AsyncGenerator<string> {
    const stream = await this.openai.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview'),
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
