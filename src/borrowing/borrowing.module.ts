import { Module } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { BorrowingController } from './borrowing.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Borrowing } from './borrowing.model';
import { Book } from '../book/book.model';
import { Member } from '../member/member.model';
import { Penalty } from '../penalty/penalty.model';

@Module({
  imports: [SequelizeModule.forFeature([Borrowing, Book, Member, Penalty])],
  providers: [BorrowingService],
  controllers: [BorrowingController],
})
export class BorrowingModule {}
