import { IEntity } from './Entity';

export interface IAnswerOption extends IEntity {
  boolean?: boolean;
  string?: string;
  strings?: string[];
  number?: number;
  numbers?: number[];
}
