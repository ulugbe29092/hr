import { IsString, IsOptional, IsEnum, IsNumber, IsDate, IsArray, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SalesPipelineStatus } from '../../../common/enums/status.enum';
import { SalePriority } from '../entities/sale.entity';

export class CreateSaleDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsString() assignedTo: string;
  @ApiPropertyOptional({ enum: SalesPipelineStatus }) @IsOptional() @IsEnum(SalesPipelineStatus) status?: SalesPipelineStatus;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) @IsDate() expectedCloseDate?: Date;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) winProbability?: number;
  @ApiPropertyOptional({ enum: SalePriority }) @IsOptional() @IsEnum(SalePriority) priority?: SalePriority;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}

export class MoveSaleDto {
  @ApiProperty({ enum: SalesPipelineStatus }) @IsEnum(SalesPipelineStatus) status: SalesPipelineStatus;
  @ApiPropertyOptional() @IsOptional() @IsNumber() order?: number;
}
