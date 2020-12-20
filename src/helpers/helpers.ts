import { RequestInit } from 'graphql-request/dist/types.dom';

export const createHeaders = (token: string): RequestInit['headers'] => ({
  Authorization: `Bearer ${token}`,
});
