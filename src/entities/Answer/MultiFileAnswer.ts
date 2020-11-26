import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { MultiFileQuestion } from '../Question/MultiFileQuestion';
import { Answer } from './Answer';

@Entity()
export class MultiFileAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => MultiFileQuestion, (question) => question.answer)
  question: MultiFileQuestion;
  @Column({ type: 'bytea', array: true })
  value: Buffer[];
}
