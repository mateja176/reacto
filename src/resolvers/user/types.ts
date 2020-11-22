import { Matches, Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, InputType, Int } from 'type-graphql';
import { Role } from '../../entities/User';

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

@InputType()
export class UserInput {
  @Field()
  @MaxLength(50)
  @Matches(/\w+\s+\w+/, {
    message: 'Name must consist of a first and last name.',
  })
  name: string;
  @Field(() => Role)
  role: Role;
}
