import { Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { IEntity } from '../../interfaces/Entity';

@ObjectType()
export class User implements IEntity {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}

@InputType()
export class UserInput {
  @Field()
  @MaxLength(50)
  name: string;
}

@ArgsType()
export class UsersArgs {
  @Field(() => Int)
  @Min(0)
  skip: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 25;
}
