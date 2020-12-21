import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { CompanyClass } from '../Company/Company';
import { QuestionClass } from '../Question/Question';
import { UserClass } from '../User/User';

@ModelOptions({ options: { customName: 'Questionnaire' } })
export class QuestionnaireClass implements Named {
  @prop()
  public name: string;
  @prop({
    comment: 'Inherited from QuestionnaireConfiguration - readonly.',
  })
  public type: string;
  @prop({ ref: () => CompanyClass })
  public company: Ref<CompanyClass>;
  @prop({ ref: () => UserClass })
  public user: Ref<UserClass>;
  @prop({ ref: () => QuestionClass })
  public inheritedQuestions: Ref<QuestionClass>[];
  @prop({ ref: () => QuestionClass })
  public questions: Ref<QuestionClass>[];
}
