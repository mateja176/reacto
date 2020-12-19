import { ApolloError, AuthenticationError } from 'apollo-server-express';

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

export class NotAuthenticatedError extends AuthenticationError {
  constructor() {
    super('You need to be authenticated to perform this action.');
  }
}
