import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection, Repository } from 'typeorm';
import { Company } from '../entities/Company';
import { User } from '../entities/User/User';
import { UserPending } from '../entities/User/UserPending';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(UserRepository, connection.getRepository(User));
  Container.set(UserPendingRepository, connection.getRepository(UserPending));

  return Container;
};

export default configureContainer;

export class CompanyRepository extends Repository<Company> {}
export class UserRepository extends Repository<User> {}
export class UserPendingRepository extends Repository<UserPending> {}
