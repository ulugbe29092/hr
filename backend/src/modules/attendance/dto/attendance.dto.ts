import { IsString, IsOptional, IsEnum, IsBoolean, IsDate, IsObject, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceMethod } from '../../../common/enums/status.enum';

export class CheckInDto {
  @ApiProperty() @IsUUID() employeeId: string;
  @ApiPropertyOptional({ enum: AttendanceMethod }) @IsOptional() @IsEnum(AttendanceMethod) method?: AttendanceMethod;
  @ApiPropertyOptional() @IsOptional() @IsObject() location?: { lat: number; lng: number; address?: string };
  @ApiPropertyOptional() @IsOptional() @IsString() qrCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() faceIdVerified?: boolean;
}

export class CheckOutDto {
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class AttendanceFilterDto {
  @IsOptional() @IsUUID() employeeId?: string;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
}
