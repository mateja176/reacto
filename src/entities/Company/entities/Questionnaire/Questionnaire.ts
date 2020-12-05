import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { NamedEntity } from '../../../../interfaces/Entity';
import { Company } from '../../Company';
import { User } from '../User/User';
import { Question } from './entities/Question/Question';
import { QuestionInherited } from './entities/Question/QuestionInherited';

@Entity()
export class Questionnaire implements NamedEntity {
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
