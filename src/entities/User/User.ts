import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { NamedEntity } from '../../interfaces/Entity';
import { Company } from '../Company/Company';
import { QuestionnaireConfiguration } from '../Company/entities/QuestionnaireConfiguration';
import { Questionnaire } from '../Questionnaire';

export enum Role {
  regular = 'regular',
  admin = 'admin',
}

@Entity()
export class User implements NamedEntity {
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
  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.user)
  questionnaires: Questionnaire[];
  /**
   * only admins may create configurations
   */
  @OneToMany(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.user,
  )
  questionnaireConfigurations?: QuestionnaireConfiguration[];
}
