import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Question } from './Question';

@Entity()
export class Answer implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question[];
  @Column()
  yesNo?: boolean;
  @Column()
  selectedAnswer?: string;
  @Column({ array: true })
  selectedAnswers?: string[];
  selectedNumberAnswer?: number;
  @Column({ array: true })
  selectedNumberAnswers?: number[];
  @Column({ type: 'bytea' })
  file?: Buffer;
  @Column({ type: 'bytea', array: true })
  multiFile?: Buffer[];
}
