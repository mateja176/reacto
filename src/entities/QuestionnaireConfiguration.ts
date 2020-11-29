import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';

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
}
