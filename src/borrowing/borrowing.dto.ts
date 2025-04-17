import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty()
  memberCode: string;

  @ApiProperty()
  bookCode: string;
}

export class ReturnBookDto {
  @ApiProperty({ example: 'M001', description: 'Member code' })
  memberCode: string;

  @ApiProperty({ example: 'JK-45', description: 'Book code' })
  bookCode: string;
}

export class ReturnResponseDto {
  @ApiProperty({
    example: 'Book returned successfully',
    description: 'Result message',
  })
  message: string;
}
