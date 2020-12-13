import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { CompanyClass } from '../Company/Company';
import { QuestionTemplateClass } from '../Question/QuestionTemplate';
import { UserClass } from '../User/User';

@ModelOptions({ options: { customName: 'QuestionnaireConfiguration' } })
export class QuestionnaireConfigurationClass implements WithName {
  @prop()
  public _id: string;
  @prop()
  public name: string;
  @prop({
    comment: 'User defined, for example: E-Commerce, Blog, Social Media',
  })
  public type: string;
  @prop({ ref: () => CompanyClass })
  public company: CompanyClass;
  @prop({ ref: () => UserClass })
  public user: Ref<UserClass>;
  @prop({ ref: () => QuestionTemplateClass })
  public questionTemplates: Ref<QuestionTemplateClass>;
}
