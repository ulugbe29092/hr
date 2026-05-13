import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Employee } from '../employees/entities/employee.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Transaction } from '../finance/entities/transaction.entity';
import { Candidate } from '../recruitment/entities/vacancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Sale, Transaction, Candidate])],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
