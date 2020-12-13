import { MaybeJWTUser } from './interfaces/JWTUser';

export interface Context {
  user: MaybeJWTUser;
}
