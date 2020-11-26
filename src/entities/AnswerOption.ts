import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { AnswerBase } from '../interfaces/AnswerBase';
import { Ruled } from '../interfaces/Ruled';
import { Question } from './Question';

@Entity()
export class AnswerOption implements AnswerBase, Ruled {
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
  @Column()
  number?: number;
  @OneToMany(() => Question, (question) => question.options)
  question: Question;
  @Column({
    comment:
      'Rule which when parsed determines whether to show or skip the option.',
  })
  rule?: string;
}
