import { ApolloError } from 'apollo-server-express';

export class EnvError extends Error {
  constructor(name: string) {
    super(`Please provide a "${name}" environment variable.`);
  }
}

export class NotFoundError extends ApolloError {
  constructor(public id: string) {
    super(`Entity with id "${id}" not found.`);
  }
}
