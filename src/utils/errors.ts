export class EnvError extends Error {
  constructor(name: string) {
    super(`Please provide a "${name}" environment variable.`);
  }
}

export class NotFoundError extends Error {
  constructor(public id: string) {
    super(`Entity with id "${id}" not found.`);
  }
}

export class NotFoundByEmailError extends Error {
  constructor(public email: string) {
    super(`User with email "${email}" not found.`);
  }
}
export class InvalidCredentialsError extends Error {
  constructor() {
    super(`The provided credentials are not valid.`);
  }
}
export class UserExistsError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists.`);
  }
}
