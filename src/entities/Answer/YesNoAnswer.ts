import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { YesNoQuestion } from '../Question/YesNoQuestion';
import { Answer } from './Answer';

@Entity()
export class YesNoAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => YesNoQuestion, (question) => question.answer)
  question: YesNoQuestion;
  @Column()
  value: boolean;
}
