import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../../interfaces/Entity';
import { Company } from '../Company';
import { Role } from './User';

@Entity()
export class UserPending implements Pick<IEntity, 'id'> {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column({ unique: true })
  email: string;
  @Column({ type: 'enum', enum: Role })
  role: Role;
  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
  @Column()
  oneOffCode: string;
}
