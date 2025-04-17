import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Borrowing } from '../borrowing/borrowing.model';
import { Penalty } from '../penalty/penalty.model';

@Table({
  tableName: 'members',
  timestamps: false,
})
export class Member extends Model<Member> {
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
  name: string;

  @HasMany(() => Borrowing)
  borrowings: Borrowing[];

  @HasMany(() => Penalty)
  penalties: Penalty[];
}
