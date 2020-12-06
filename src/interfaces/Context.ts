import { Connection } from 'typeorm';
import { User } from '../generated/resolvers';

export interface Context {
  connection: Connection;
  user: User;
}
