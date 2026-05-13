import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() sku: string;
  @ApiPropertyOptional() @IsOptional() @IsString() barcode?: string;
  @ApiProperty() @IsNumber() unitPrice: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() costPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() stockQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minStockLevel?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isTrackable?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class StockMovementDto {
  @ApiProperty({ enum: ['in', 'out', 'adjustment'] })
  @IsEnum(['in', 'out', 'adjustment'])
  movementType: 'in' | 'out' | 'adjustment';

  @ApiProperty() @IsNumber() @Min(1) quantity: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
