import { Company, User } from '../generated/graphql';

export interface JWTUser
  extends Omit<
    User,
    'company' | 'questionnaires' | 'questionnaireConfiguration'
  > {
  company: Pick<Company, 'id' | 'name'>;
}

export type MaybeJWTUser = JWTUser | null;
