import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Member } from '../member/member.model';

@Table({
  tableName: 'penalties',
  timestamps: true,
  updatedAt: false,
})
export class Penalty extends Model<Penalty> {
  //   @ApiProperty()
  //   @Column({
  //     type: DataType.INTEGER,
  //     primaryKey: true,
  //     autoIncrement: true,
  //   })
  //   id: number;

  @ApiProperty()
  @ForeignKey(() => Member)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  memberCode: string;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  startAt: Date;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endAt: Date;
}
