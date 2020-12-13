import { ModelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { Class } from '../../interfaces/Class';
import { QuestionClass } from '../Question/Question';

/**
 * Answer values are saved even in case of questions with default values.
 * In rare cases where the default question value has changed.
 * This would be inconsistent in relation the to default user was presented with, at the time of answering.
 */
@ModelOptions({ options: { customName: 'Answer', allowMixed: Severity.ALLOW } })
export class AnswerClass implements Class {
  @prop()
  public _id: string;
  @prop({ ref: () => QuestionClass })
  public question: Ref<QuestionClass>;
  @prop()
  public boolean?: boolean;
  @prop({ comment: 'Textual' })
  public string?: string;
  @prop({ array: true, comment: 'Select Textual' })
  public strings?: string[];
  @prop({ array: true, comment: 'Multi-select Textual' })
  public multiStrings?: string[];
  @prop({ comment: 'Numerical' })
  public number?: number;
  @prop({ array: true, comment: 'Select Numerical' })
  public numbers?: number;
  @prop({ array: true, comment: 'Multi-select Numerical' })
  public multiNumbers?: number[];
  @prop({ comment: 'File URL' })
  public file?: string;
  @prop({ comment: "File URL's" })
  public files?: string[];
}
