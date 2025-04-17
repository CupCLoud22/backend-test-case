import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.model';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'stock', required: false, type: Number })
  async findAll(
    @Query('code') code?: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('stock') stock?: number,
  ): Promise<{ data: Book[] }> {
    return await this.bookService.findAll(code, title, author, stock);
  }
}
