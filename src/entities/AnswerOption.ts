import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IAnswerOption } from '../interfaces/AnswerOption';

@Entity()
export class AnswerOption implements IAnswerOption {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column()
  boolean?: boolean;
  @Column()
  string?: string;
  @Column({ array: true })
  strings?: string[];
  number?: number;
  @Column({ array: true })
  numbers?: number[];
}
