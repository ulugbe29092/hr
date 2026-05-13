import { IsUUID, IsEnum, IsDate, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveType } from '../entities/leave.entity';

export class CreateLeaveDto {
  @ApiProperty() @IsUUID() employeeId: string;
  @ApiProperty({ enum: LeaveType }) @IsEnum(LeaveType) type: LeaveType;
  @ApiProperty() @Type(() => Date) @IsDate() startDate: Date;
  @ApiProperty() @Type(() => Date) @IsDate() endDate: Date;
  @ApiProperty() @IsString() reason: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isHalfDay?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() attachmentUrl?: string;
}

export class ApproveLeaveDto {
  @ApiProperty() approved: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() rejectionReason?: string;
}
