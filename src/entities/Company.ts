import { Column, Entity, ObjectIdColumn, OneToMany, OneToOne } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { QuestionnaireConfiguration } from './QuestionnaireConfiguration';
import { User } from './User';

@Entity()
export class Company implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToMany(() => User, (user) => user.company)
  users: User[];
  @OneToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.company,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
}
