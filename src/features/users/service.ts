import { User, UserInput, UsersArgs } from './types';

export const userService: UserService = {
  findById: (id) => Promise.resolve({ id: '1', name: 'John Doe' }),
  findAll: (args) => Promise.resolve([{ id: '1', name: 'John Doe' }]),
  addNew: (input) => Promise.resolve({ id: '2', name: input.name }),
  removeById: (id) => Promise.resolve({ id: '1', name: 'John Doe' }),
};

export interface UserService {
  findById: (id: User['id']) => Promise<User>;
  findAll: (args: UsersArgs) => Promise<User[]>;
  addNew: (userInput: UserInput) => Promise<User>;
  removeById: (id: User['id']) => Promise<User>;
}
