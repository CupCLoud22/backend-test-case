import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './member.model';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  async findAll(
    @Query('code') code?: string,
    @Query('name') name?: string,
  ): Promise<{ data: Member[] }> {
    return await this.memberService.findAll(code, name);
  }
}
