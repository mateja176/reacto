import { Entity, ManyToOne } from 'typeorm';
import { QuestionnaireConfiguration } from '../../../User/entities/QuestionnaireConfiguration';
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
