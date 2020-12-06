import { Connection } from 'mongoose';
import { JWTUser } from '../graphql/user/types/JWTUser';

export interface Context {
  connection: Connection;
  user: JWTUser;
}
