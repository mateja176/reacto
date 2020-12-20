import { GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';
import { pick } from 'ramda';
import { v4 } from 'uuid';
import { Role as UserRole } from '../classes/User/User';
import { endpoint } from '../config/config';
import { AdminRole } from '../generated/graphql';
import {
  AdminLoginMutationVariables,
  getSdk,
  InviteMutationVariables,
  RegisterRegularMutationVariables,
  Role,
} from '../generated/sdk';
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
    const { userDoc } = await createCompanyAndUser({
      ...pick(['password', 'name'], seedInput),
      email: env.mailGunEmail,
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
