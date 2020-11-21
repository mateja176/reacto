import { Connection } from 'mongoose';

export interface Context {
  connection: Connection;
}
