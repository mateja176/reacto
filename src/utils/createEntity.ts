import { DeepPartial, MongoRepository } from 'typeorm';
import { IEntity } from '../interfaces/Entity';

export const createRootEntity = <E extends IEntity>(
  repository: MongoRepository<E>,
  props: Omit<E, 'id'>,
) => {
  const entity = repository.create(props as DeepPartial<E>);

  return entity;
};

export const createEntity = <E extends IEntity>(
  repository: MongoRepository<E>,
  props: E,
) => {
  const entity = repository.create();

  Object.entries(props).forEach(([key, value]) => {
    entity[key as keyof E] = value;
  });

  return entity;
};
