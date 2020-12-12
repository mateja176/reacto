import { Company, User } from '../generated/graphql';

export interface JWTUser
  extends Omit<User, 'company'>,
    Pick<Company, 'id' | 'name'> {}
