import { Module } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { PenaltyController } from './penalty.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Penalty } from './penalty.model';
import { Member } from '../member/member.model';

@Module({
  imports: [SequelizeModule.forFeature([Penalty, Member])],
  providers: [PenaltyService],
  controllers: [PenaltyController],
  //   exports: [PenaltyService], // Add this if PenaltyService needs to be used elsewhere
})
export class PenaltyModule {}
