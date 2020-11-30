import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm';
import { Question } from './Question/Question';

/**
 * Answer values are saved even in case of questions with default values.
 * In rare cases where the default question value has changed.
 * This would be inconsistent in relation the to default user was presented with, at the time of answering.
 */
@Entity()
export class Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToOne(() => Question, (question) => question.answer)
  question: Question[];
  @Column({ comment: 'Yes or No' })
  boolean?: boolean;
  @Column({ comment: 'Textual' })
  string?: string;
  @Column({ array: true, comment: 'Select Textual' })
  strings?: string[];
  @Column({ array: true, comment: 'Multi-select Textual' })
  multiStrings?: string[];
  @Column({ comment: 'Numerical' })
  number?: number;
  @Column({ array: true, comment: 'Select Numerical' })
  numbers?: number;
  @Column({ array: true, comment: 'Multi-select Numerical' })
  multiNumbers?: number[];
  @Column({ type: 'bytea', comment: 'File' })
  file?: Buffer;
  @Column({ type: 'bytea', array: true, comment: 'Multi-file' })
  files?: Buffer[];
}
