import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { Questionnaire } from './Questionnaire';

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
  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.user)
  questionnaires: Questionnaire;
}
