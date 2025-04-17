import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty()
  memberCode: string;

  @ApiProperty()
  bookCode: string;
}

export class ReturnBookDto {
  @ApiProperty()
  memberCode: string;

  @ApiProperty()
  bookCode: string;
}
