import {
  IsEmail,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import {
  ArgsType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from 'type-graphql';
import { Role } from '../../entities/User';
import { IEntity } from '../../interfaces/Entity';
import { IsPassword } from '../../utils/validators';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType('User')
export class UserOutput implements IEntity {
  @Field(() => ID)
  id: string;
  @Field()
  email: string;
  @Field({ description: 'First name and last name' })
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

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @Validate(IsPassword)
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => UserOutput)
  user: UserOutput;
  @Field()
  token: string;
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
