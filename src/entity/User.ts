import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

@Entity()
@ObjectType()
export class User implements IEntity {
  @ObjectIdColumn({ unique: true })
  @Field(() => ID)
  id: string;
  @Column()
  @Field({ description: 'First name and last name' })
  name: string;
}
