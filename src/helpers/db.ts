import { mongoose } from '@typegoose/typegoose';
import { GraphQLClient } from 'graphql-request';
import { endpoint } from '../config/config';
import { getSdk } from '../generated/sdk';
import createToken from '../services/createToken';
import { Models } from '../services/models';
import { createHeaders } from './helpers';
import { userDocToJWTUser } from './map';
import { createCompanyAndUser, SeedInput } from './seed';

export const createQuestionnaireClass = async (
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
