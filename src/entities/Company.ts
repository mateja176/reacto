import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Questionnaire } from './Questionnaire';
import { QuestionnaireConfiguration } from './QuestionnaireConfiguration';
import { User } from './User/User';

@Entity()
export class Company implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column(() => User)
  owner: User;
  @OneToMany(() => User, (user) => user.company)
  users: User[];
  @OneToMany(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.company,
  )
  questionnaireConfigurations: QuestionnaireConfiguration[];
  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.company)
  questionnaires: Questionnaire[];
}
