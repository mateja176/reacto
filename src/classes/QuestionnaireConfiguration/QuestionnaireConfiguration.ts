import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { CompanyClass } from '../Company/Company';
import { QuestionTemplateClass } from '../Question/QuestionTemplate';
import { UserClass } from '../User/User';

@ModelOptions({ options: { customName: 'QuestionnaireConfiguration' } })
export class QuestionnaireConfigurationClass implements Named {
  @prop()
  public name: string;
  @prop({
    comment: 'User defined, for example: E-Commerce, Blog, Social Media',
  })
  public type: string;
  @prop({ ref: () => CompanyClass })
  public company: Ref<CompanyClass>;
  @prop({ ref: () => UserClass })
  public user: Ref<UserClass>;
  @prop({ ref: () => QuestionTemplateClass })
  public questionTemplates: Ref<QuestionTemplateClass>[];
}
