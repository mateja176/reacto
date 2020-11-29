import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Questionnaire implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Company, (company) => company.questionnaires)
  company: Company;
  @ManyToOne(() => User, (user) => user.questionnaires)
  user: User;
  @OneToMany(() => Question, (question) => question.questionnaireConfiguration)
  questions: Question[];
}
