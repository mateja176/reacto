import Container from 'typedi';
import { Connection } from 'typeorm';
import { Identifiers } from './config/container';
import { User } from './entities/User';
import { createRepository } from './utils/container';

const configureContainer = (connection: Connection): Container => {
  Container.set(Identifiers.userRepository, createRepository(connection, User));

  return Container;
};

export default configureContainer;
