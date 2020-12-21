/* eslint-disable @typescript-eslint/ban-types */

import { MaybeJWTUser } from './interfaces/JWTUser';
import { Models } from './services/models';

export interface Context {
  user: MaybeJWTUser;
  models: Models;
}
