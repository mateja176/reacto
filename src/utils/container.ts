import { Connection, DeepPartial, EntityTarget } from 'typeorm';
import { IRepository } from '../interfaces/container';
import { IEntity } from '../interfaces/Entity';

export const createRepository = <E extends IEntity>(
  connection: Connection,
  Entity: EntityTarget<E>,
) => {
  const connectionRepository = connection.getRepository(Entity);

  const repository = {
    ...connectionRepository,
    make: (props) => {
      const [newEntity] = connectionRepository.create([
        (props as unknown) as DeepPartial<E>, // * TypeScript does not understand that E is a subtype of DeepPartial<E>
      ]);

      return newEntity;
    },
  } as IRepository<E>;

  return repository;
};
