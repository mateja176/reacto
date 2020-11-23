import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection } from 'typeorm';
import { User } from './entities/User';
import { UserRepository } from './utils/container';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(UserRepository, connection.getRepository(User));

  return Container;
};

export default configureContainer;
