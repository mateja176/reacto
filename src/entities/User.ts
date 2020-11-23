import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

export enum Role {
  regular = 'regular',
  admin = 'admin',
}

@Entity()
export class User implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  name: string;
  @Column()
  role: Role;
}
