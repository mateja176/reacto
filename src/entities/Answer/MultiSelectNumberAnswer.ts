import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { MultiSelectNumberQuestion } from '../Question/MultiSelectNumberQuestion';
import { Answer } from './Answer';

@Entity()
export class MultiSelectNumberAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => MultiSelectNumberQuestion, (question) => question.answer)
  question: MultiSelectNumberQuestion;
  @Column({ nullable: true })
  text: string;
  @Column({ nullable: true, array: true })
  options: string[];
  @Column({ array: true })
  value: number[];
}
