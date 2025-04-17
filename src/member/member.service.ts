import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from './member.model';
import { Op } from 'sequelize';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member)
    private memberModel: typeof Member,
  ) {}

  async findAll(code?: string, name?: string): Promise<{ data: Member[] }> {
    try {
      const whereClause: any = {};

      if (code) {
        whereClause.code = { [Op.iLike]: `%${code}%` };
      }
      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      const members = await this.memberModel.findAll({
        where: whereClause,
      });

      return { data: members };
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
  }
}
