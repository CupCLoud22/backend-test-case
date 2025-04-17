import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './member.model';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll(
    @Query('code') code?: string,
    @Query('name') name?: string,
  ): Promise<{ data: Member[] }> {
    const result = await this.memberService.findAll(code, name);
    return result;
  }
}
