import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { PenaltyModule } from './penalty/penalty.module';
import { Book } from './book/book.model';
import { Member } from './member/member.model';
import { Borrowing } from './borrowing/borrowing.model';
import { Penalty } from './penalty/penalty.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: 'Asia/Jakarta',
      models: [Book, Member, Borrowing, Penalty],
      autoLoadModels: true,
      synchronize: false,
    }),
    BookModule,
    MemberModule,
    BorrowingModule,
    PenaltyModule,
  ],
})
export class AppModule {}
