import { IsString, IsOptional, IsEnum, IsNumber, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TransactionType, TransactionCategory, TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ enum: TransactionType }) @IsEnum(TransactionType) type: TransactionType;
  @ApiProperty({ enum: TransactionCategory }) @IsEnum(TransactionCategory) category: TransactionCategory;
  @ApiProperty() @IsNumber() amount: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiPropertyOptional({ enum: TransactionStatus }) @IsOptional() @IsEnum(TransactionStatus) status?: TransactionStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() referenceNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachmentUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() taxAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isRecurring?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() recurringInterval?: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class FinanceFilterDto {
  @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @IsOptional() @IsEnum(TransactionCategory) category?: TransactionCategory;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
}
