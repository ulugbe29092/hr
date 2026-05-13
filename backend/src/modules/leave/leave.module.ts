import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { Leave, LeaveBalance } from './entities/leave.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leave, LeaveBalance])],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
