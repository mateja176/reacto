import { GraphQLClient } from 'graphql-request';
import mongoose from 'mongoose';
import { endpoint } from '../config/config';
import { getSdk } from '../generated/sdk';
import { createHeaders } from '../helpers/helpers';
import { userDocToJWTUser } from '../helpers/map';
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

describe('questionnaire configuration', () => {
  beforeEach(async () => {
    await mongoose.connect(env.mongodbURI);
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await mongoose.connection.close();
  });
  test('create', async () => {
    const { userDoc } = await createCompanyAndUser(seedInput);

    const token = createToken(userDocToJWTUser(userDoc));

    const sdk = getSdk(
      new GraphQLClient(endpoint, {
        headers: createHeaders(token),
      }),
    );

    const type = 'Test';
    const {
      createQuestionnaireConfiguration,
    } = await sdk.CreateQuestionnaireConfiguration({
      input: {
        name: 'Test Questionnaire',
        type,
      },
    });

    expect(createQuestionnaireConfiguration.type).toBe(type);
  });
});