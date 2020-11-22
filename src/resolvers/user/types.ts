import { Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, InputType, Int } from 'type-graphql';
import { Role } from '../../entities/User';

@InputType()
export class UserInput {
  @Field()
  @MaxLength(50)
  name: string;
  @Field(() => Role)
  role: Role;
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
