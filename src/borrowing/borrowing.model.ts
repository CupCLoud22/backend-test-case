// src/borrowing/borrowing.model.ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Book } from '../book/book.model';
import { Member } from '../member/member.model';

@Table({
  tableName: 'borrowings',
  timestamps: true,
  updatedAt: false,
  paranoid: false,
})
export class Borrowing extends Model {
  //   @Column({
  //     type: DataType.INTEGER,
  //     primaryKey: true,
  //     autoIncrement: true,
  //   })
  //   id: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bookCode: string;

  @BelongsTo(() => Book)
  book: Book;

  @ForeignKey(() => Member)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  memberCode: string;

  @BelongsTo(() => Member)
  member: Member;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  borrowedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  returnedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDeleted: boolean;
}
