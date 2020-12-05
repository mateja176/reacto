import { DeepPartial, MongoRepository } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

export const createEntity = <E extends IEntity>(
  repository: MongoRepository<E>,
  props: Omit<E, 'id'>,
) => {
  const entity = repository.create(props as DeepPartial<E>);

  return entity;
};
