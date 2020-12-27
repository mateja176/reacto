import { ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { Named } from '../../interfaces/Class';
import { Ruled } from '../../interfaces/Ruled';

@ModelOptions({
  options: { allowMixed: Severity.ALLOW },
})
export class QuestionBase implements Named, Ruled {
  @prop()
  public name: string;
  @prop()
  public label: string;
  @prop()
  public rule?: string;
  @prop()
  public optional: boolean;
  @prop()
  public boolean?: { default?: boolean };
  @prop()
  public string?: { default?: string };
  @prop()
  public strings?: {
    options: string[];
    allowOtherOption: boolean;
    default?: string;
  };
  @prop()
  public multiStrings?: {
    options: string[];
    otherOptionsCount: number;
    default?: string[];
  };
  @prop()
  public number?: { default?: number };
  @prop()
  public numbers?: {
    options: number[];
    allowOtherOption: boolean;
    default?: number;
  };
  @prop()
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
