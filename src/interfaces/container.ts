import { Repository } from 'typeorm';

export type IRepository<E> = Repository<E> & {
  make: (props: { [key in Exclude<keyof E, 'id'>]: E[key] }) => E;
};
