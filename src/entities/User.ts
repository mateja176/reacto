import { Column, Entity, ManyToMany, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';

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
  @ManyToMany(() => Company, (company) => company.managers)
  company: Company;
}
