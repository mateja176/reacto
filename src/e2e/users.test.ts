import { GraphQLClient } from 'graphql-request';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { pick } from 'ramda';
import { v4 } from 'uuid';
import { Role as UserRole } from '../classes/User/User';
import { endpoint } from '../config/config';
import { mongodbConfig } from '../config/mongodb';
import {
  AdminLoginMutationVariables,
  getSdk,
  InviteMutationVariables,
  RegisterRegularMutationVariables,
  Role,
} from '../generated/sdk';
import { createHeaders } from '../helpers/helpers';
import { userDocToJWTUser } from '../helpers/map';
import {
  createCompanyAndUser,
  SeedInput,
  seedInputSchema,
} from '../helpers/seed';
import createToken from '../services/createToken';
import env from '../services/env';
import { PendingUserModel } from '../services/models';

const { value } = seedInputSchema.validate({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  name: process.env.NAME,
});
const seedInput: SeedInput = value;

let mongoServer: MongoMemoryServer;

describe('users', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await mongoose.connect(await mongoServer.getUri(), mongodbConfig);
  });
  afterAll(async () => {
    await mongoose.connection.close();

    await mongoServer.stop();
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
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
    const { userDoc } = await createCompanyAndUser({
      ...pick(['password', 'name'], seedInput),
      email: env.mailGunEmail,
    });

    const token = createToken(userDocToJWTUser(userDoc));

    const sdk = getSdk(
      new GraphQLClient(endpoint, {
        headers: createHeaders(token),
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
  test('register', async () => {
    const { companyDoc } = await createCompanyAndUser(seedInput);

    const token = v4();

    await PendingUserModel.create({
      email: env.mailGunEmail,
      role: UserRole.regular,
      company: companyDoc._id,
      token,
    });

    const sdk = getSdk(new GraphQLClient(endpoint));

    const registerVars: RegisterRegularMutationVariables = {
      input: {
        name: 'Reacto Dev',
        password: seedInput.password,
        token,
      },
    };

    const { register } = await sdk.RegisterRegular(registerVars);

    if (register.user.__typename !== 'RegularUser') {
      throw new Error('User is not a regular user.');
    }
    expect(register.user.email).toBe(env.mailGunEmail);
  });
});
