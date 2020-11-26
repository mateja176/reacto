import { IEntity } from '../../interfaces/Entity';
import { Question } from '../Question/Question';

export interface Answer extends IEntity {
  question: Question;
}
