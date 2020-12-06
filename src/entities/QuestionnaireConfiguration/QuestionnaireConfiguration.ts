import { prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { Company } from '../Company/Company';
import { QuestionTemplate } from '../Question/QuestionTemplate';
import { User } from '../User/User';

export class QuestionnaireConfiguration implements WithName {
  @prop()
  public name: string;
  @prop({
    comment: 'User defined, for example: E-Commerce, Blog, Social Media',
  })
  public type: string;
  @prop({ ref: Company })
  public company: Company;
  @prop({ ref: User })
  public user: Ref<User>;
  @prop({ ref: QuestionTemplate })
  public questionTemplates: Ref<QuestionTemplate>;
}
