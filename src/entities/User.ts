import { Column, Entity, ManyToMany, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { QuestionnaireConfiguration } from './QuestionnaireConfiguration';

export enum Role {
  regular = 'regular',
  admin = 'admin',
}

@Entity()
export class User implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @Column({ type: 'enum', enum: Role })
  role: Role;
  @ManyToMany(() => Company, (company) => company.users)
  company: Company;
  @OneToMany(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.user,
  )
  questionnaireConfigurations: QuestionnaireConfiguration;
}
