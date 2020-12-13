import { Company, User } from '../generated/graphql';

export interface JWTUser extends Omit<User, 'company'> {
  company: Pick<Company, 'id' | 'name'>;
}
