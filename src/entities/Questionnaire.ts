import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { Question } from './Question/Question';
import { QuestionInherited } from './Question/QuestionInherited';
import { User } from './User/User';

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
  @OneToMany(() => QuestionInherited, (question) => question.questionnaire)
  inheritedQuestions: QuestionInherited;
  @OneToMany(() => Question, (question) => question.questionnaire)
  questions: Question[];
}