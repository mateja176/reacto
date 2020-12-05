import { Entity, ManyToOne } from 'typeorm';
import { QuestionnaireConfiguration } from '../Company/entities/QuestionnaireConfiguration';
import { QuestionBase } from './QuestionBase';

@Entity()
export class QuestionTemplate extends QuestionBase {
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) =>
      questionnaireConfiguration.questionTemplates,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
}
