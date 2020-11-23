import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection } from 'typeorm';
import { UserRepository } from './config/container';
import { User } from './entities/User';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(UserRepository, connection.getRepository(User));

  return Container;
};

export default configureContainer;
