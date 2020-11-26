import { IEntity } from '../../interfaces/Entity';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';

export interface Question extends IEntity {
  questionnaireConfiguration: QuestionnaireConfiguration;
}
