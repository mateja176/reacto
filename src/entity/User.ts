import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

export enum Role {
  regular = 'regular',
  admin = 'admin',
}
registerEnumType(Role, {
  name: 'Role',
});

@Entity()
@ObjectType()
export class User implements IEntity {
  @ObjectIdColumn({ unique: true })
  @Field(() => ID)
  id: string;
  @Column()
  @Field({ description: 'First name and last name' })
  name: string;
  @Column()
  @Field(() => Role)
  role: Role;
}