import { prop } from '@typegoose/typegoose';
import { WithName } from '../../interfaces/Entity';
import { Ruled } from '../../interfaces/Ruled';

export class QuestionBase implements WithName, Ruled {
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
  @prop({
    comment:
      'If the array is empty, a switch is displayed. If the array has one member a single checkbox is displayed. If the array has two members two radio buttons are displayed.',
  })
  public boolean?: {
    value: [] | [string] | [string, string];
    default?: boolean;
  };
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
}
