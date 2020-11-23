import { Repository } from 'typeorm';
import { User } from '../entities/User';

export enum Identifiers {
  userRepository = 'userRepository',
}

export type UserRepository = Repository<User>;
