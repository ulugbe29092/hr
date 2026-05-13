import { IsString, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AiChatDto {
  @ApiProperty({ example: 'Analyze our team performance this month' })
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class AiResumeAnalysisDto {
  @ApiProperty()
  @IsString()
  cvText: string;

  @ApiProperty()
  @IsString()
  vacancyDescription: string;
}

export class AiReportDto {
  @ApiProperty({ example: 'monthly_finance' })
  @IsString()
  reportType: string;

  @ApiProperty()
  @IsObject()
  data: Record<string, any>;
}

export class AiForecastDto {
  @ApiPropertyOptional({ default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  months?: number = 3;
}
