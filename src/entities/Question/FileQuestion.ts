import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { FileAnswer } from '../Answer/FileAnswer';
import { QuestionnaireConfiguration } from '../QuestionnaireConfiguration';
import { Question } from './Question';

@Entity()
export class FileQuestion implements Question {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @ManyToOne(
    () => QuestionnaireConfiguration,
    (questionnaireConfiguration) => questionnaireConfiguration.fileQuestions,
  )
  questionnaireConfiguration: QuestionnaireConfiguration;
  @OneToMany(() => FileAnswer, (answer) => answer.question)
  answer: FileAnswer[];
}
