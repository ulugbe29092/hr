import {
  IsString, IsEmail, IsOptional, IsEnum, IsNumber,
  IsDate, IsArray, MinLength, IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { EmploymentType, Gender } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty() @IsString() @MinLength(2) firstName: string;
  @ApiProperty() @IsString() @MinLength(2) lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatarUrl?: string;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) @IsDate() dateOfBirth?: Date;
  @ApiProperty() @Type(() => Date) @IsDate() hireDate: Date;
  @ApiProperty() @IsString() jobTitle: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() managerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() userId?: string;
  @ApiPropertyOptional({ enum: EmploymentType }) @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @ApiProperty() @IsNumber() baseSalary: number;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() skills?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() workLocation?: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
