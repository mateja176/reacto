import { Connection } from 'typeorm';
import { UserOutput } from '../resolvers/user/types/types';

export interface Context {
  connection: Connection;
  user: UserOutput;
}
