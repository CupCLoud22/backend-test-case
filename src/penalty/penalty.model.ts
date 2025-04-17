import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Member } from '../member/member.model';

@Table({
  tableName: 'penalties',
  timestamps: true,
  updatedAt: false,
})
export class Penalty extends Model<Penalty> {
  // @Column({
  //   type: DataType.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true,
  // })
  // id: number;

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
  startAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endAt: Date;
}
