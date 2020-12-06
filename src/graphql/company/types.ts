import { Field, ID, ObjectType } from 'type-graphql';
import { NamedEntity } from '../../interfaces/Entity';
import { UserOutput } from '../user/types/types';
import { UserPendingOutput } from '../user/types/UserPendingOutput';

@ObjectType('Company')
export class CompanyOutput implements NamedEntity {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field(() => UserOutput)
  owner: UserOutput;
  @Field(() => [UserOutput])
  users: UserOutput[];
  @Field(() => UserPendingOutput)
  pendingUsers: UserPendingOutput[];
  // @Field(() => [QuestionnaireConfigurationOutput])
  // questionnaireConfigurations: QuestionnaireOutput[];
  // @Field(() => [QuestionnaireOutput])
  // questionnaires: QuestionnaireOutput[];
}
