import Container from 'typedi';
import { Connection } from 'typeorm';
import { User } from './entity/User';

export enum Identifiers {
  userRepository = 'userRepository',
}

const configureContainer = (connection: Connection): Container => {
  Container.set(Identifiers.userRepository, connection.getRepository(User));

  return Container;
};

export default configureContainer;
