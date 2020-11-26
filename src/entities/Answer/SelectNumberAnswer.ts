import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { SelectNumberQuestion } from '../Question/SelectNumberQuestion';
import { Answer } from './Answer';

@Entity()
export class SelectNumberAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => SelectNumberQuestion, (question) => question.answer)
  question: SelectNumberQuestion;
  @Column()
  value: number;
}
