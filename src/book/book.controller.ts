import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.model';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(
    @Query('code') code?: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('stock') stock?: number,
  ): Promise<{ data: Book[] }> {
    const result = await this.bookService.findAll(code, title, author, stock);
    return result;
  }
}
