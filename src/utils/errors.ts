import { ApolloError } from 'apollo-server-express';

export class EnvError extends Error {
  constructor(name: string) {
    super(`Please provide a "${name}" environment variable.`);
  }
}

export class NotFoundError extends ApolloError {
  constructor() {
    super('Not found.');
  }
}

export class AlreadyExistsError extends ApolloError {
  constructor() {
    super('Already exists.');
  }
}
