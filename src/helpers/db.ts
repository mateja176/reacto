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

type CreateParams = { models: Models; seedInput: SeedInput };

export const createQuestionnaireConfigurationDoc = async ({
  models,
  seedInput,
}: CreateParams) => {
  const { companyDoc, userDoc } = await createCompanyAndUser(models)(seedInput);

  const questionnaireConfigurationId = mongoose.Types.ObjectId();

  const questionTemplate = await models.QuestionTemplate.create({
    name: 'Test',
    label: 'How are you?',
    optional: false,
    string: {},
    questionnaireConfiguration: questionnaireConfigurationId,
  });

  const type = 'Test';
  const questionnaireConfigurationDoc = await models.QuestionnaireConfiguration.create(
    {
      _id: questionnaireConfigurationId,
      name: 'Test Questionnaire Configuration',
      type,
      company: companyDoc._id,
      user: userDoc._id,
      questionTemplates: [questionTemplate._id],
    },
  );

  const token = createToken(userDocToJWTUser(userDoc));

  const sdk = getSdk(
    new GraphQLClient(endpoint, {
      headers: createHeaders(token),
    }),
  );

  return {
    sdk,
    companyDoc,
    userDoc,
    questionnaireConfigurationDoc,
    type,
  };
};

export const createQuestionnaireDoc = async (params: CreateParams) => {
  const questionnaireConfigurationOutput = await createQuestionnaireConfigurationDoc(
    params,
  );
  const { companyDoc, userDoc } = questionnaireConfigurationOutput;

  const { models } = params;

  const questionnaireId = mongoose.Types.ObjectId();

  const questionnaireDoc = await models.Questionnaire.create({
    _id: questionnaireId,
    type: 'Test',
    name: 'Test',
    user: String(userDoc._id),
    company: String(companyDoc._id),
    inheritedQuestions: [],
    questions: [],
  });

  return { ...questionnaireConfigurationOutput, questionnaireDoc };
};

export const createStringQuestionDoc = async (params: CreateParams) => {
  const questionnaireData = await createQuestionnaireDoc(params);

  const { questionnaireDoc } = questionnaireData;

  const questionDoc = await params.models.Question.create({
    name: 'Test',
    label: 'How are you?',
    optional: false,
    string: { default: 'Fine, thank you.' },
    questionnaire: questionnaireDoc._id,
  });

  return { ...questionnaireData, questionDoc };
};

export const createStringQuestionTemplateDoc = async (params: CreateParams) => {
  const questionnaireConfigurationData = await createQuestionnaireConfigurationDoc(
    params,
  );

  const { questionnaireConfigurationDoc } = questionnaireConfigurationData;

  const questionTemplateDoc = await params.models.QuestionTemplate.create({
    name: 'Test',
    label: 'How are you?',
    optional: false,
    string: { default: 'Fine, thank you.' },
    questionnaireConfiguration: questionnaireConfigurationDoc._id,
  });

  return { ...questionnaireConfigurationData, questionTemplateDoc };
};
