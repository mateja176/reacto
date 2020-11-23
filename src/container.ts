import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection } from 'typeorm';
import { Identifiers } from './config/container';
import { User } from './entities/User';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(Identifiers.userRepository, connection.getRepository(User));

  return Container;
};

export default configureContainer;
