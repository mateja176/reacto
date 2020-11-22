import { Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, InputType, Int } from 'type-graphql';

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
