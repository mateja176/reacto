import { Connection } from 'typeorm';
import { JWTUser } from './jwt';

export interface Context {
  connection: Connection;
  user: JWTUser;
}
