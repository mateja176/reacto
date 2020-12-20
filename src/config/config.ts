import env from '../services/env';

export const path = '/graphql';

export const endpoint = `http://localhost:${env.port}${path}`;
