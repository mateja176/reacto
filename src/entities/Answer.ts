import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Question } from './Question';

@Entity()
export class Answer implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToOne(() => Question, (question) => question.answer)
  question: Question[];
  @Column()
  boolean?: boolean;
  @Column()
  string?: string;
  @Column({ array: true })
  strings?: string[];
  number?: number;
  @Column({ array: true })
  numbers?: number[];
  @Column({ type: 'bytea' })
  file?: Buffer;
  @Column({ type: 'bytea', array: true })
  files?: Buffer[];
}
