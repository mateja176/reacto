import { Connection } from 'typeorm';
import { UserOutput } from '../graphql/company/graphql/user/types/types';

export interface Context {
  connection: Connection;
  user: UserOutput;
}
