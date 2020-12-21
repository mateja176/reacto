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
import {
  QuestionnaireConfigurationModel,
  QuestionTemplateModel,
} from '../services/models';

const { value } = seedInputSchema.validate({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  name: process.env.NAME,
});
const seedInput: SeedInput = value;

describe('questionnaire', () => {
  beforeEach(async () => {
    await mongoose.connect(
      await new MongoMemoryServer().getUri(),
      mongodbConfig,
    );
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await mongoose.connection.close();
  });
  test('create', async () => {
    const { companyDoc, userDoc } = await createCompanyAndUser(seedInput);

    const questionnaireConfigurationId = mongoose.Types.ObjectId();

    const questionTemplate = await QuestionTemplateModel.create({
      name: 'Test Template',
      label: 'How are you?',
      optional: false,
      questionnaireConfiguration: questionnaireConfigurationId,
      string: {},
    });

    await QuestionnaireConfigurationModel.create({
      _id: questionnaireConfigurationId,
      name: 'Test Questionnaire Configuration',
      type: 'Test',
      company: companyDoc._id,
      user: userDoc._id,
      questionTemplates: [questionTemplate._id],
    });

    const token = createToken(userDocToJWTUser(userDoc));

    const sdk = getSdk(
      new GraphQLClient(endpoint, {
        headers: createHeaders(token),
      }),
    );

    const type = 'Test';
    const {
      createQuestionnaire,
    } = await sdk.CreateQuestionnaireWithStringQuestion({
      input: {
        name: 'Test Questionnaire',
        questionnaireConfigurationId: questionnaireConfigurationId.toHexString(),
      },
    });

    expect(createQuestionnaire.type).toBe(type);
    expect(createQuestionnaire.inheritedQuestions[0].__typename).toBe(
      'StringQuestion',
    );
  });
});
