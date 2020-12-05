import { Column, PrimaryColumn } from 'typeorm';
import { NamedEntity } from '../../../../../../../../interfaces/Entity';
import { Ruled } from '../../../../../../../../interfaces/Ruled';

export class QuestionTemplate implements NamedEntity, Ruled {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column()
  name: string;
  @Column({ comment: 'The text of the question.' })
  label: string;
  @Column({
    comment:
      'Rule which when parsed determines whether to show or skip the question.',
  })
  rule?: string;
  @Column({
    default: false,
    comment:
      'The corresponding questionnaire may be complete with having an answer for the respective optional question.',
  })
  optional: boolean;
  @Column({
    array: true,

    comment:
      'If the array is empty, a switch is displayed. If the array has one member a single checkbox is displayed. If the array has two members two radio buttons are displayed.',
  })
  boolean?: [] | [string] | [string, string];
  @Column({ default: false })
  booleanDefault?: boolean;
  @Column()
  stringDefault?: string;
  @Column({ array: true, comment: 'Select Textual' })
  strings?: string[];
  @Column()
  stringsDefault?: string;
  @Column({ array: true, comment: 'Multi-select Textual' })
  multiStrings?: string[];
  @Column({ array: true })
  multiStringsDefault?: string[];
  @Column()
  numberDefault?: number;
  @Column({ array: true, comment: 'Select Numerical' })
  numbers?: number[];
  @Column()
  numbersDefault?: number;
  @Column({ array: true, comment: 'Multi-select Numerical' })
  multiNumbers?: number[];
  @Column({ array: true })
  multiNumbersDefault?: number[];
}
