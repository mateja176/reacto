import { Column, Entity, ObjectIdColumn, OneToMany, OneToOne } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { Question } from './Question';

@Entity()
export class QuestionnaireConfiguration implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToOne(() => Company, (company) => company.questionnaireConfiguration)
  company: Company;
  @OneToMany(() => Question, (question) => question.questionnaireConfiguration)
  questions: Question[];
}
