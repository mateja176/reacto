import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { NamedClass } from '../../interfaces/Class';
import { CompanyClass } from '../Company/Company';
import { QuestionClass } from '../Question/Question';
import { UserClass } from '../User/User';

@ModelOptions({ options: { customName: 'Questionnaire' } })
export class QuestionnaireClass implements NamedClass {
  @prop()
  public _id: string;
  @prop()
  public name: string;
  @prop({ ref: () => CompanyClass })
  public company: CompanyClass;
  @prop({ ref: () => UserClass })
  public user: Ref<UserClass>;
  @prop({ ref: () => QuestionClass })
  public inheritedQuestions: QuestionClass[];
  @prop({ ref: () => QuestionClass })
  public questions: QuestionClass[];
}
