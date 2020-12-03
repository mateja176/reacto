import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection } from 'typeorm';
import { User } from './entities/User/User';
import { UserPending } from './entities/User/UserPending';
import { UserPendingRepository, UserRepository } from './utils/container';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(UserRepository, connection.getRepository(User));
  Container.set(UserPendingRepository, connection.getRepository(UserPending));

  return Container;
};

export default configureContainer;
