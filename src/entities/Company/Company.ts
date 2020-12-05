import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { NamedEntity } from '../../interfaces/Entity';
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
  @Column(() => User)
  users: User[];
  @Column(() => UserPending)
  pendingUsers: UserPending[];
}
