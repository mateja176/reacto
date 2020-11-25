import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { User } from './User';

@Entity()
export class Company implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToMany(() => User, (user) => user.company)
  managers: User[];
}
