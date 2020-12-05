import { ContainerType } from 'type-graphql';
import Container from 'typedi';
import { Connection, MongoRepository } from 'typeorm';
import { Company } from '../entities/Company/Company';
import { User } from '../entities/User/User';
import { UserPending } from '../entities/User/UserPending';

const configureContainer = (connection: Connection): ContainerType => {
  Container.set(CompanyRepository, connection.getMongoRepository(Company));
  Container.set(UserRepository, connection.getMongoRepository(User));
  Container.set(
    UserPendingRepository,
    connection.getMongoRepository(UserPending),
  );

  return Container;
};

export default configureContainer;

export class CompanyRepository extends MongoRepository<Company> {}
export class UserRepository extends MongoRepository<User> {}
export class UserPendingRepository extends MongoRepository<UserPending> {}
