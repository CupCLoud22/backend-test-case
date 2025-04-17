import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Borrowing } from '../borrowing/borrowing.model';

@Table({
  tableName: 'books',
  timestamps: false,
})
export class Book extends Model<Book> {
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    autoIncrement: true,
  })
  code: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  author: string;

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  stock: number;

  @HasMany(() => Borrowing)
  borrowings: Borrowing[];
}
