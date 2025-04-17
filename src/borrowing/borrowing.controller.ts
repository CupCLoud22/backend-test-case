import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { Borrowing } from './borrowing.model';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BorrowBookDto, ReturnBookDto } from './borrowing.dto';

@ApiTags('borrowings')
@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Get()
  async findAll(): Promise<{ data: Borrowing[] }> {
    const data = await this.borrowingService.findAll();
    return { data };
  }

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 200, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return await this.borrowingService.borrowBook(
      borrowBookDto.memberCode,
      borrowBookDto.bookCode,
    );
  }

  @Post('return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async returnBook(
    @Body() returnBookDto: ReturnBookDto,
  ): Promise<{ message: string }> {
    try {
      return await this.borrowingService.returnBook(
        returnBookDto.memberCode,
        returnBookDto.bookCode,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
