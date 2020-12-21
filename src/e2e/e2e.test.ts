import { ApolloServer } from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { pick } from 'ramda';
import { v4 } from 'uuid';
import { Role as UserRole } from '../classes/User/User';
import { endpoint } from '../config/config';
import { mongodbConfig } from '../config/mongodb';
import createServer from '../createServer';
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
import { createModels, Models } from '../services/models';

const { value } = seedInputSchema.validate({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  name: process.env.NAME,
});
const seedInput: SeedInput = value;

let mongoServer: MongoMemoryServer;
let server: ApolloServer;
let connection: mongoose.Connection;
let models: Models;

describe('e2e', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    connection = await mongoose.createConnection(uri, mongodbConfig);
    server = await createServer(connection);
    models = createModels(connection);
  });
  afterAll(async () => {
    await connection.close();

    await server.stop();

    await mongoServer.stop();
  });
  afterEach(async () => {
    await connection.db.dropDatabase();
  });
  describe('users', () => {
    test('login', async () => {
      await createCompanyAndUser(models)(seedInput);

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
      const { userDoc } = await createCompanyAndUser(models)({
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
      const { companyDoc } = await createCompanyAndUser(models)(seedInput);

      const token = v4();

      await models.PendingUser.create({
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

  describe('questionnaire', () => {
    test('create', async () => {
      const { companyDoc, userDoc } = await createCompanyAndUser(models)(
        seedInput,
      );

      const questionnaireConfigurationId = mongoose.Types.ObjectId();

      const questionTemplate = await models.QuestionTemplate.create({
        name: 'Test Template',
        label: 'How are you?',
        optional: false,
        questionnaireConfiguration: questionnaireConfigurationId,
        string: {},
      });

      await models.QuestionnaireConfiguration.create({
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

    describe('questionnaire configuration', () => {
      test('create', async () => {
        const { userDoc } = await createCompanyAndUser(models)(seedInput);

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
  });
});
