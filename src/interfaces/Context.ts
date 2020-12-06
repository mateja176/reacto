import { Connection } from 'mongoose';
import { UserOutput } from '../graphql/company/graphql/user/types/types';

export interface Context {
  connection: Connection;
  user: UserOutput;
}
