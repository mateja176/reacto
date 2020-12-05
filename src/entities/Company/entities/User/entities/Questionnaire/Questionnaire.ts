import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NamedEntity } from '../../../../../../interfaces/Entity';
import { Question } from './entities/Question/Question';

@Entity()
export class Questionnaire implements NamedEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column()
  name: string;
  @Column(() => Question)
  inheritedQuestions: Question;
  @Column(() => Question)
  questions: Question[];
}
