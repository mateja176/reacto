import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../../../../interfaces/Entity';
import { Role } from './User';

@Entity()
export class UserPending implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column({ unique: true })
  email: string;
  @Column({ type: 'enum', enum: Role })
  role: Role;
}
