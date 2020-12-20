import { GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';
import { pick } from 'ramda';
import { endpoint } from '../config/config';
import { AdminRole } from '../generated/graphql';
import {
  AdminLoginMutationVariables,
  getSdk,
  InviteMutationVariables,
  Role,
} from '../generated/sdk';
import {
  createCompanyAndUser,
  SeedInput,
  seedInputSchema,
} from '../helpers/seed';
import createToken from '../services/createToken';
import env from '../services/env';

const { value } = seedInputSchema.validate({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  name: process.env.NAME,
});
const seedInput: SeedInput = value;

const reactoEmail = 'reactodevelopment@gmail.com';

describe('users', () => {
  beforeEach(async () => {
    await mongoose.connect(env.mongodbURI);
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await mongoose.connection.close();
  });
  test('login', async () => {
    await createCompanyAndUser(seedInput);

    const sdk = getSdk(new GraphQLClient(endpoint));

    const loginVars: AdminLoginMutationVariables = {
      input: pick(['email', 'password'], seedInput),
    };

    const { logIn } = await sdk.AdminLogin(loginVars);

    if (logIn.user.__typename !== 'AdminUser') {
      throw new Error('User is not admin.');
    }

    expect(logIn.user.email).toEqual(seedInput.email);
    expect(typeof logIn.token).toBe('string');
  });
  test('invite', async () => {
    const userDoc = await createCompanyAndUser({
      ...pick(['password', 'name'], seedInput),
      email: reactoEmail,
    });

    const token = createToken({
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      company: { id: String(userDoc.company) },
      role: AdminRole.admin,
    });

    const sdk = getSdk(
      new GraphQLClient(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    const inviteVars: InviteMutationVariables = {
      input: {
        email: seedInput.email,
        role: Role.Regular,
      },
    };

    const { invite } = await sdk.Invite(inviteVars);

    expect(invite.email).toEqual(seedInput.email);
  });
});
