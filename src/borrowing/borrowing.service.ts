// src/borrowing/borrowing.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Borrowing } from './borrowing.model';
import { Book } from '../book/book.model';
import { Member } from '../member/member.model';
import { Penalty } from '../penalty/penalty.model';
import { Op, Sequelize, WhereOptions } from 'sequelize';

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
    @InjectConnection()
    private readonly sequelize: Sequelize, // Add this line
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

    // // Check if member has active penalty
    // const activePenalty = await this.penaltyModel.findOne({
    //   where: {
    //     memberCode,
    //     endAt: { [Op.gt]: new Date() }, // Penalty not expired yet
    //   },
    // });

    // if (activePenalty) {
    //   const penaltyHoursLeft = Math.ceil(
    //     (activePenalty.endAt.getTime() - new Date().getTime()) /
    //       (1000 * 60 * 60),
    //   );
    //   throw new BadRequestException(
    //     `Member is currently penalized and cannot borrow books. Penalty expires in ${penaltyHoursLeft} hours.`,
    //   );
    // }

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

    // Check if member has more than 2 active borrowings
    const activeBorrowings = await this.borrowingModel.count({
      where: {
        memberCode,
        returnedAt: null,
      },
    });
    if (activeBorrowings >= 2) {
      throw new BadRequestException('Member cannot borrow more than 2 books');
    }

    // Create borrowing record
    const borrowing = await this.borrowingModel.create({
      bookCode,
      memberCode,
      borrowedAt: new Date(),
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      isDeleted: false,
    });

    // Update book stock and member's borrowing count
    await Promise.all([
      book.decrement('stock'),
      member.increment('booksBeingBorrowed'),
    ]);

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

    // Calculate if returned late (more than 7 days)
    // const returnDate = new Date();
    // const borrowedDate = borrowing.borrowedAt;
    // const daysBorrowed = Math.ceil(
    //   (returnDate.getTime() - borrowedDate.getTime()) / (1000 * 60 * 60 * 24),
    // );
    // const isLate = daysBorrowed > 7;

    // Mark as returned (soft delete)
    await borrowing.update({
      returnedAt: new Date(),
      isDeleted: true,
    });

    // // Increase book stock
    // const book = await this.bookModel.findByPk(bookCode);
    // if (book) {
    //   await book.increment('stock');
    // }

    // Update book stock and member's borrowing count
    const [book, member] = await Promise.all([
      this.bookModel.findByPk(bookCode),
      this.memberModel.findByPk(memberCode),
    ]);

    // await Promise.all([
    //   book?.increment('stock'),
    //   member?.decrement('booksBeingBorrowed'),
    // ]);

    // Update counters
    await Promise.all([
      book?.increment('stock', { by: 1 }),
      member?.decrement('booksBeingBorrowed', { by: 1 }),
    ]);

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

    // // Apply penalty if late
    // if (isLate) {
    //   const penaltyEndDate = new Date();
    //   penaltyEndDate.setDate(penaltyEndDate.getDate() + 3); // 3 days penalty

    //   await this.penaltyModel.create({
    //     memberCode,
    //     startAt: new Date(),
    //     endAt: penaltyEndDate,
    //   } as any);

    //   return {
    //     message: `Book returned successfully. Late return (${daysBorrowed - 7} days overdue). Penalty applied for 3 days.`,
    //   };
    // }

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
