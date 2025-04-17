import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'books',
  timestamps: false,
})
export class Book extends Model<Book> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    autoIncrement: true,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  author: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  stock: number;
}
