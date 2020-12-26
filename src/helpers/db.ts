import { mongoose } from '@typegoose/typegoose';
import { GraphQLClient } from 'graphql-request';
import { Role } from '../classes/User/User';
import { endpoint } from '../config/config';
import { getSdk } from '../generated/sdk';
import createToken from '../services/createToken';
import hashPassword from '../services/hashPassword';
import { Models } from '../services/models';
import { createHeaders } from './helpers';
import { userDocToJWTUser } from './map';
import { SeedInput } from './seed';

export const createCompanyAndUser = (models: Models) => async ({
  name,
  email,
  password,
}: SeedInput) => {
  const userId = mongoose.Types.ObjectId();

  const reacto = await models.Company.create({
    name: 'Reacto',
    owner: userId,
    pendingUsers: [],
    users: [],
    questionnaireConfigurations: [],
    questionnaires: [],
  });

  const userDoc = await models.User.create({
    _id: userId,
    name,
    email,
    passwordHash: await hashPassword(password),
    role: Role.admin,
    questionnaires: [],
    company: reacto._id,
  });

  return { userDoc, companyDoc: reacto };
};

export const createQuestionnaireConfigurationClass = async (
  models: Models,
  seedInput: SeedInput,
) => {
  const { companyDoc, userDoc } = await createCompanyAndUser(models)(seedInput);

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

  return { sdk, questionnaireConfigurationId };
};
