import { ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { Ruled } from '../../interfaces/Ruled';

@ModelOptions({
  options: { allowMixed: Severity.ALLOW },
})
export class QuestionBase implements Named, Ruled {
  @prop()
  public name: string;
  @prop({ comment: 'The text of the question.' })
  public label: string;
  @prop({
    comment:
      'Rule which when parsed determines whether to show or skip the question.',
  })
  public rule?: string;
  @prop({
    default: false,
    comment:
      'The corresponding questionnaire may be complete with having an answer for the respective optional question.',
  })
  public optional: boolean;
  @prop()
  public boolean?: { default?: boolean };
  @prop()
  public string?: { default?: string };
  @prop({ comment: 'Select Textual' })
  public strings?: {
    options: string[];
    allowOtherOption: boolean;
    default?: string;
  };
  @prop({ comment: 'Multi-select Textual' })
  public multiStrings?: {
    options: string[];
    otherOptionsCount: number;
    default?: string[];
  };
  @prop()
  public number?: { default?: number };
  @prop({ comment: 'Select Numerical' })
  public numbers?: {
    options: number[];
    allowOtherOption: boolean;
    default?: number;
  };
  @prop({ comment: 'Multi-select Numerical' })
  public multiNumbers?: {
    options: number[];
    otherOptionsCount: number;
    default?: number[];
  };
  @prop()
  public file?: { default?: string };
  @prop()
  public files?: { default?: string[] };
}
