import { User } from '../entities/User';
import { IRepository } from '../interfaces/container';

export enum Identifiers {
  userRepository = 'userRepository',
}

export type UserRepository = IRepository<User>;
