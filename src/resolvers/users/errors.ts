export class UserNotFoundError extends Error {
  constructor(public id: string) {
    super(`User with id ${id} not found.`);
  }
}
