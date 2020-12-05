import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { NamedEntity } from '../../interfaces/Entity';
import { Questionnaire } from '../Questionnaire';
import { QuestionnaireConfiguration } from './entities/QuestionnaireConfiguration';
import { User } from './entities/User/User';
import { UserPending } from './entities/User/UserPending';

@Entity()
export class Company implements NamedEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column(() => User)
  owner: User;
  @OneToMany(() => User, (user) => user.company)
  users: User[];
  @OneToMany(() => UserPending, (user) => user.company)
  pendingUsers: UserPending[];
  @OneToMany(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.company,
  )
  questionnaireConfigurations: QuestionnaireConfiguration[];
  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.company)
  questionnaires: Questionnaire[];
}
