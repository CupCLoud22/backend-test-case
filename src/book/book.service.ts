import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './book.model';
import { Op } from 'sequelize';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}

  async findAll(
    code?: string,
    title?: string,
    author?: string,
    stock?: number,
  ): Promise<{ data: Book[] }> {
    try {
      const whereClause: any = {};

      if (code) {
        whereClause.code = { [Op.iLike]: `%${code}%` };
      }
      if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
      }
      if (author) {
        whereClause.author = { [Op.iLike]: `%${author}%` };
      }
      if (stock !== undefined) {
        whereClause.stock = stock;
      }

      const books = await this.bookModel.findAll({
        where: whereClause,
      });

      return { data: books };
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
  }
}
