import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { VacancyStatus, CandidateStatus, ExperienceLevel } from '../entities/vacancy.entity';

export class CreateVacancyDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() requirements: string;
  @ApiProperty({ enum: ExperienceLevel }) @IsEnum(ExperienceLevel) experienceLevel: ExperienceLevel;
  @ApiProperty() @IsString() employmentType: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salaryMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salaryMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isRemote?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) @IsDate() deadline?: Date;
  @ApiPropertyOptional() @IsOptional() @IsNumber() positionsCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() skillsRequired?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() benefits?: string[];
}

export class CreateCandidateDto {
  @ApiProperty() @IsUUID() vacancyId: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty() @IsString() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cvUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedinUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expectedSalary?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() yearsOfExperience?: number;
}

export class MoveCandidateDto {
  @ApiProperty({ enum: CandidateStatus }) @IsEnum(CandidateStatus) status: CandidateStatus;
  @ApiPropertyOptional() @IsOptional() @IsNumber() order?: number;
}
