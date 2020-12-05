import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NamedEntity } from '../../../../interfaces/Entity';
import { Questionnaire } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';

export enum Role {
  owner = 'owner',
  admin = 'admin',
  regular = 'regular',
}

@Entity()
export class User implements NamedEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @Column({ type: 'enum', enum: Role })
  role: Role;
  @Column(() => Questionnaire)
  questionnaires: Questionnaire[];
  /**
   * only admins may create configurations
   */
  @Column(() => QuestionnaireConfiguration)
  questionnaireConfigurations?: QuestionnaireConfiguration[];
}
