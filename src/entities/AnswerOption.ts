import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { AnswerBase } from '../interfaces/AnswerBase';

@Entity()
export class AnswerOption implements AnswerBase {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column({
    array: true,
    default: ['No', 'Yes'],
    comment: 'The label used for the "false" and the label used for "true".',
  })
  boolean?: [string, string];
  @Column()
  string?: string;
  @Column({ array: true })
  strings?: string[];
  number?: number;
  @Column({ array: true })
  numbers?: number[];
}
