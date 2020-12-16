import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { CompanyClass } from '../Company/Company';
import { QuestionnaireClass } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfigurationClass } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';

export enum Role {
  admin = 'admin',
  regular = 'regular',
}

@ModelOptions({ options: { customName: 'User' } })
export class UserClass implements Named {
  @prop()
  public name: string;
  @prop({ unique: true })
  public email: string;
  @prop()
  public passwordHash: string;
  @prop({ enum: Role })
  public role: Role;
  @prop({ ref: () => CompanyClass })
  public company: Ref<CompanyClass>;
  @prop({ ref: () => QuestionnaireClass })
  questionnaires: Ref<QuestionnaireClass>[];
  /**
   * only admins may create configurations
   */
  @prop({ ref: () => QuestionnaireConfigurationClass })
  public questionnaireConfigurations?: Ref<QuestionnaireConfigurationClass>[];
}
