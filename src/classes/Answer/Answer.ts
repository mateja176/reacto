import { ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { QuestionClass } from '../Question/Question';

/**
 * Answer values are saved even in case of questions with default values.
 * In rare cases where the default question value has changed.
 * This would be inconsistent in relation the to default user was presented with, at the time of answering.
 */
@ModelOptions({ options: { customName: 'Answer', allowMixed: Severity.ALLOW } })
export class AnswerClass {
  @prop({ ref: () => QuestionClass })
  public question: Ref<QuestionClass>;
  @prop()
  public boolean?: boolean;
  @prop()
  public string?: string;
  @prop({ array: true })
  public strings?: string;
  @prop({ array: true })
  public multiStrings?: string[];
  @prop()
  public number?: number;
  @prop({ array: true })
  public numbers?: number;
  @prop({ array: true })
  public multiNumbers?: number[];
  @prop()
  public file?: string;
  @prop()
  public files?: string[];
}
