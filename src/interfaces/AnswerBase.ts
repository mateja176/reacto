import { IEntity } from './Entity';

export interface AnswerBase extends IEntity {
  string?: string;
  number?: number;
}
