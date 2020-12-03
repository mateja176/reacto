import { Column, Entity, ManyToOne, ObjectIdColumn, OneToMany } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';
import { QuestionTemplate } from './Question/QuestionTemplate';
import { User } from './User/User';

@Entity()
export class QuestionnaireConfiguration implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @Column({
    comment: 'User defined, for example: E-Commerce, Blog, Social Media',
  })
  type: string;
  @ManyToOne(() => Company, (company) => company.questionnaireConfigurations)
  company: Company;
  @ManyToOne(() => User, (user) => user.questionnaireConfigurations)
  user: User;
  @OneToMany(
    () => QuestionTemplate,
    (questionTemplate) => questionTemplate.questionnaireConfiguration,
  )
  questionTemplates: QuestionTemplate;
}
