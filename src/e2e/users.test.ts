import { GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';
import { pick } from 'ramda';
import { endpoint } from '../config/config';
import { AdminLoginMutationVariables, getSdk } from '../generated/sdk';
import { createCompanyAndUser, SeedInput } from '../helpers/seed';
import env from '../services/env';

const seedInput: SeedInput = {
  email: 'reactodevelopment@gmail.com',
  password: '12345678A!',
  name: 'Reacto Dev',
};
const loginArgs: AdminLoginMutationVariables = {
  input: pick(['email', 'password'], seedInput),
};

describe('users', () => {
  beforeEach(async () => {
    await mongoose.connect(env.mongodbURI);

    await createCompanyAndUser(seedInput);
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await mongoose.connection.close();
  });
  test('login', async () => {
    const sdk = getSdk(new GraphQLClient(endpoint));

    const { logIn } = await sdk.AdminLogin(loginArgs);

    if (logIn.user.__typename !== 'AdminUser') {
      throw new Error('User is not admin.');
    }

    expect(logIn.user.email).toEqual(seedInput.email);
    expect(typeof logIn.token).toBe('string');
  });
});
