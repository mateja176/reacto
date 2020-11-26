import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { FileQuestion } from './Question/FileQuestion';
import { MultiFileQuestion } from './Question/MultiFileQuestion';
import { MultiSelectNumberQuestion } from './Question/MultiSelectNumberQuestion';
import { MultiSelectQuestion } from './Question/MultiSelectQuestion';
import { SelectNumberQuestion } from './Question/SelectNumberQuestion';
import { SelectQuestion } from './Question/SelectQuestion';
import { YesNoQuestion } from './Question/YesNoQuestion';

@Entity()
export class QuestionnaireConfiguration implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Company, (company) => company.questionnaireConfigurations)
  company: Company;
  @OneToMany(
    () => YesNoQuestion,
    (question) => question.questionnaireConfiguration,
  )
  yesNoQuestions: YesNoQuestion[];
  @OneToMany(
    () => SelectQuestion,
    (question) => question.questionnaireConfiguration,
  )
  selectQuestions: SelectQuestion[];
  @OneToMany(
    () => MultiSelectQuestion,
    (question) => question.questionnaireConfiguration,
  )
  multiSelectQuestions: MultiSelectQuestion[];
  @OneToMany(
    () => SelectNumberQuestion,
    (question) => question.questionnaireConfiguration,
  )
  selectNumberQuestions: SelectNumberQuestion[];
  @OneToMany(
    () => MultiSelectNumberQuestion,
    (question) => question.questionnaireConfiguration,
  )
  multiSelectNumberQuestions: MultiSelectNumberQuestion[];
  @OneToMany(
    () => FileQuestion,
    (question) => question.questionnaireConfiguration,
  )
  fileQuestions: FileQuestion[];
  @OneToMany(
    () => MultiFileQuestion,
    (question) => question.questionnaireConfiguration,
  )
  multiFileQuestions: MultiFileQuestion[];
}
