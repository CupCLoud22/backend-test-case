import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table, DataType } from 'sequelize-typescript';

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
}
