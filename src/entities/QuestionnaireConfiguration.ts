import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class QuestionnaireConfiguration implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Company, (company) => company.questionnaireConfigurations)
  company: Company;
  @OneToMany(() => Question, (question) => question.questionnaireConfiguration)
  questions: Question[];
  @ManyToOne(() => User, (user) => user.questionnaireConfigurations)
  user: User;
}
