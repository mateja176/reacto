import { Company, User } from '../generated/graphql';

export interface JWTUser extends Pick<User, 'id' | 'email' | 'name' | 'role'> {
  company: Pick<Company, 'id'>;
}

export type MaybeJWTUser = JWTUser | null;
