import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../../entities/Company/entities/User/User';
import { NamedEntity } from '../../interfaces/Entity';
import { UserPendingOutput } from './graphql/user/types/UserPendingOutput';

@ObjectType('Company')
export class CompanyOutput implements NamedEntity {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field(() => [User])
  users: User[];
  @Field(() => UserPendingOutput)
  pendingUsers: UserPendingOutput[];
  // @Field(() => [QuestionnaireConfigurationOutput])
  // questionnaireConfigurations: QuestionnaireOutput[];
  // @Field(() => [QuestionnaireOutput])
  // questionnaires: QuestionnaireOutput[];
}
