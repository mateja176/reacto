import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { FileQuestion } from '../Question/FileQuestion';
import { Answer } from './Answer';

@Entity()
export class FileAnswer implements Answer {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => FileQuestion, (question) => question.answer)
  question: FileQuestion;
  @Column({ type: 'bytea' })
  value: Buffer;
}
