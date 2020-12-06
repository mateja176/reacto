import { prop, Ref } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { Company } from '../Company/Company';
import { Questionnaire } from '../Questionnaire/Questionnaire';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration/QuestionnaireConfiguration';

export enum Role {
  admin = 'admin',
  regular = 'regular',
}

export class User implements WithName {
  @prop()
  public _id: string;
  @prop()
  public name: string;
  @prop({ unique: true })
  public email: string;
  @prop()
  public passwordHash: string;
  @prop({ enum: Role })
  public role: Role;
  @prop({ ref: () => Company })
  public company: Ref<Company>;
  @prop({ ref: () => Questionnaire })
  questionnaires: Questionnaire[];
  /**
   * only admins may create configurations
   */
  @prop({ ref: () => QuestionnaireConfiguration })
  public questionnaireConfigurations?: Ref<QuestionnaireConfiguration>[];
}
