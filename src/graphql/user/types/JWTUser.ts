import { CompanyOutput } from '../../company/types';
import { UserOutput } from './types';

export interface JWTUser extends Omit<UserOutput, 'company'> {
  company: Pick<CompanyOutput, 'id' | 'name'>;
}
