import { prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { Company } from '../Company/Company';
import { Question } from '../Question/Question';
import { User } from '../User/User';

export class Questionnaire implements WithName {
  @prop()
  public name: string;
  @prop({ ref: Company })
  public company: Company;
  @prop({ ref: User })
  public user: Ref<User>;
  @prop({ ref: Question })
  public inheritedQuestions: Question;
  @prop({ ref: Question })
  public questions: Question[];
}
