import { IsUUID, IsNumber, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreatePayrollDto {
  @ApiProperty() @IsUUID() employeeId: string;
  @ApiProperty() @IsInt() @Min(1) @Max(12) month: number;
  @ApiProperty() @IsInt() year: number;
  @ApiProperty() @IsNumber() baseSalary: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() overtimePay?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() bonus?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allowances?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() deductions?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fines?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() workingDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() absentDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() overtimeHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {}
