import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { QuestionnaireClass } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';
import { UserClass } from '../User/User';
import { UserPendingClass } from '../User/UserPending';

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
  @prop({ ref: () => UserPendingClass })
  public pendingUsers: Ref<UserPendingClass>[];
  @prop({
    ref: () => QuestionnaireConfigurationClass,
  })
  public questionnaireConfigurations: Ref<QuestionnaireConfigurationClass>[];
  @prop({ ref: () => QuestionnaireClass })
  public questionnaires: QuestionnaireClass[];
}
