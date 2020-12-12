import { Connection } from 'mongoose';
import { JWTUser } from './interfaces/JWTUser';

export interface Context {
  connection: Connection;
  user: JWTUser;
}
