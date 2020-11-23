import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities/User';
import { IEntity } from '../interfaces/Entity';

export const createEntity = <E extends IEntity>(
  repository: Repository<E>,
  props: Omit<E, 'id'>,
) => {
  const [entity] = repository.create([props as DeepPartial<E>]);

  return entity;
};

export class UserRepository extends Repository<User> {}
