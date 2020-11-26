import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { MultiSelectQuestion } from '../Question/MultiSelectQuestion';
import { Answer } from './Answer';

@Entity()
export class MultiSelectAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => MultiSelectQuestion, (question) => question.answer)
  question: MultiSelectQuestion;
  @Column({ array: true })
  value: string[];
}
