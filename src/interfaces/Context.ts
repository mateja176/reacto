import { Connection } from 'typeorm';
import { UserOutput } from '../graphql/user/types/types';

export interface Context {
  connection: Connection;
  user: UserOutput;
}
