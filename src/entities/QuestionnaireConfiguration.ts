import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm';
import { IEntity } from '../interfaces/Entity';
import { Company } from './Company';

@Entity()
export class QuestionnaireConfiguration implements IEntity {
  @ObjectIdColumn({ unique: true })
  id: string;
  @Column()
  name: string;
  @OneToOne(() => Company, (company) => company.questionnaireConfiguration)
  company: Company;
}
