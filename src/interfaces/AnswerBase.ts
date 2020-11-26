import { IEntity } from './Entity';

export interface AnswerBase extends IEntity {
  string?: string;
  strings?: string[];
  number?: number;
  numbers?: number[];
}
