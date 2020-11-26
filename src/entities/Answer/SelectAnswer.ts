import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { SelectQuestion } from '../Question/SelectQuestion';
import { Answer } from './Answer';

@Entity()
export class SelectAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => SelectQuestion, (question) => question.answer)
  question: SelectQuestion;
  @Column()
  value: string;
}
