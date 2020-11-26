import { IEntity } from './Entity';

export interface AnswerBase extends IEntity {
  boolean?: boolean;
  string?: string;
  strings?: string[];
  number?: number;
  numbers?: number[];
}
