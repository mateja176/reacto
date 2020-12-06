import { prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { Questionnaire } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { User } from '../User/User';
import { UserPending } from '../User/UserPending';

export class Company implements WithName {
  @prop()
  public _id: string;
  @prop()
  public name: string;
  @prop({ ref: () => User })
  public owner: Ref<User>;
  @prop({ ref: () => User })
  public users: Ref<User>[];
  @prop({ ref: () => UserPending })
  public pendingUsers: Ref<UserPending>[];
  @prop({
    ref: () => QuestionnaireConfiguration,
  })
  public questionnaireConfigurations: Ref<QuestionnaireConfiguration>[];
  @prop({ ref: () => Questionnaire })
  public questionnaires: Questionnaire[];
}
