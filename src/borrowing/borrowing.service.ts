// src/borrowing/borrowing.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Borrowing } from './borrowing.model';
import { Book } from '../book/book.model';
import { Member } from '../member/member.model';
import { Penalty } from '../penalty/penalty.model';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectModel(Borrowing)
    private borrowingModel: typeof Borrowing,
    @InjectModel(Book)
    private bookModel: typeof Book,
    @InjectModel(Member)
    private memberModel: typeof Member,
    @InjectModel(Penalty)
    private penaltyModel: typeof Penalty,
  ) {}

  async borrowBook(memberCode: string, bookCode: string): Promise<Borrowing> {
    // Check if member exists
    const member = await this.memberModel.findByPk(memberCode);
    if (!member) {
      throw new BadRequestException('Member not found');
    }

    // Check if book exists
    const book = await this.bookModel.findByPk(bookCode);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    // Check if book is already borrowed (isDeleted = false)
    const existingBorrowing = await this.borrowingModel.findOne({
      where: {
        bookCode,
        isDeleted: false,
      } as WhereOptions<Borrowing>,
    });

    if (existingBorrowing) {
      throw new BadRequestException(
        'Book is already borrowed by another member',
      );
    }

    // Create borrowing record
    const borrowing = await this.borrowingModel.create({
      bookCode,
      memberCode,
      borrowedAt: new Date(),
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      isDeleted: false,
    });

    // Decrease book stock
    await book.decrement('stock');

    return borrowing;
  }

  async returnBook(
    memberCode: string,
    bookCode: string,
  ): Promise<{ message: string }> {
    // Find active borrowing (isDeleted = false)
    const borrowing = await this.borrowingModel.findOne({
      where: {
        memberCode,
        bookCode,
        isDeleted: false,
      } as WhereOptions<Borrowing>,
    });

    if (!borrowing) {
      throw new BadRequestException(
        'No active borrowing found for this member and book',
      );
    }

    // Mark as returned (soft delete)
    await borrowing.update({
      returnedAt: new Date(),
      isDeleted: true,
    });

    // Increase book stock
    const book = await this.bookModel.findByPk(bookCode);
    if (book) {
      await book.increment('stock');
    }

    // Check if late return
    if (new Date() > borrowing.dueAt) {
      await this.penaltyModel.create({
        memberCode,
        startAt: new Date(),
        endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days penalty
      } as any);
      return {
        message: 'Book returned successfully (late return, penalty applied)',
      };
    }

    return { message: 'Book returned successfully' };
  }

  // Example of findAll method that considers isDeleted
  async findAll(): Promise<Borrowing[]> {
    return this.borrowingModel.findAll({
      where: {
        isDeleted: false,
      } as WhereOptions<Borrowing>,
    });
  }
}
