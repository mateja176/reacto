import { ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { Ruled } from '../../interfaces/Ruled';

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
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
  public booleanDefault?: boolean;
  @prop()
  public stringDefault?: string;
  @prop({ comment: 'Select Textual' })
  public strings?: { value: string[]; default?: string };
  @prop({ comment: 'Multi-select Textual' })
  public multiStrings?: { value: string[]; default: string[] };
  @prop()
  public numberDefault?: number;
  @prop({ comment: 'Select Numerical' })
  public numbers?: { value: number[]; default: number };
  @prop({ comment: 'Multi-select Numerical' })
  public multiNumbers?: { value: number[]; default: number[] };
  @prop()
  public fileDefault?: string;
  @prop()
  public filesDefault?: string[];
}
