import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NamedEntity } from '../../../../../interfaces/Entity';
import { QuestionTemplate } from '../../Questionnaire/entities/Question/QuestionTemplate';

@Entity()
export class QuestionnaireConfiguration implements NamedEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column()
  name: string;
  @Column({
    comment: 'User defined, for example: E-Commerce, Blog, Social Media',
  })
  type: string;
  @Column(() => QuestionTemplate)
  questionTemplates: QuestionTemplate[];
}
