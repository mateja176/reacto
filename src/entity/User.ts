import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

@Entity()
@ObjectType()
export class User implements IEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column()
  @Field()
  name: string;
}
