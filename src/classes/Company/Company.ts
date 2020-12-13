import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { QuestionnaireClass } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { PendingUserClass } from '../User/PendingUser';
import { UserClass } from '../User/User';

@ModelOptions({ options: { customName: 'Company' } })
export class CompanyClass implements WithName {
  @prop()
  public _id: string;
  @prop()
  public name: string;
  @prop({ ref: () => UserClass })
  public owner: Ref<UserClass>;
  @prop({ ref: () => UserClass })
  public users: Ref<UserClass>[];
  @prop({ ref: () => PendingUserClass })
  public pendingUsers: Ref<PendingUserClass>[];
  @prop({
    ref: () => QuestionnaireConfigurationClass,
  })
  public questionnaireConfigurations: Ref<QuestionnaireConfigurationClass>[];
  @prop({ ref: () => QuestionnaireClass })
  public questionnaires: QuestionnaireClass[];
}
