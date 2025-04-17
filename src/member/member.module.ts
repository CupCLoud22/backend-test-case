import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from './member.model';

@Module({
  imports: [SequelizeModule.forFeature([Member])],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
