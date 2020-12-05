import { Field, ID, ObjectType } from 'type-graphql';
import { Role } from '../../../entities/Company/entities/User/User';

@ObjectType('UserPending')
export class UserPendingOutput {
  @Field(() => ID)
  id: string;
  @Field()
  email: string;
  @Field()
  role: Role;
}
