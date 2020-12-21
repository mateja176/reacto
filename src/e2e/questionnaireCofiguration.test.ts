import { GraphQLClient } from 'graphql-request';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { endpoint } from '../config/config';
import { mongodbConfig } from '../config/mongodb';
import { getSdk } from '../generated/sdk';
import { createHeaders } from '../helpers/helpers';
import { userDocToJWTUser } from '../helpers/map';
import {
  createCompanyAndUser,
  SeedInput,
  seedInputSchema,
} from '../helpers/seed';
import createToken from '../services/createToken';

const { value } = seedInputSchema.validate({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  name: process.env.NAME,
});
const seedInput: SeedInput = value;

let mongoServer: MongoMemoryServer;

describe('questionnaire configuration', () => {
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
