import { DocumentType, mongoose } from '@typegoose/typegoose';
import { ApolloError } from 'apollo-server-express';
import { AnswerClass } from '../../classes/Answer/Answer';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Context } from '../../Context';
import { AdminRole, Nullable } from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
import {
  AnswerConfig,
  BooleanAnswerConfig,
  BooleanAnswerUpdateConfig,
  CreateAnswerDocConfig,
  FileAnswerConfig,
  FileAnswerUpdateConfig,
  FilesAnswerConfig,
  FilesAnswerUpdateConfig,
  MultiNumbersAnswerConfig,
  MultiNumbersAnswerUpdateConfig,
  MultiStringsAnswerConfig,
  MultiStringsAnswerUpdateConfig,
  NumberAnswerConfig,
  NumberAnswerUpdateConfig,
  NumbersAnswerConfig,
  NumbersAnswerUpdateConfig,
  StringAnswerConfig,
  StringAnswerUpdateConfig,
  StringsAnswerConfig,
  StringsAnswerUpdateConfig,
  UpdateAnswerConfig,
} from './interfaces';
import {
  createAnswerDoc,
  mapBooleanAnswer,
  mapFileAnswer,
  mapFilesAnswer,
  mapMultiNumbersAnswer,
  mapMultiStringsAnswer,
  mapNumberAnswer,
  mapNumbersAnswer,
  mapStringAnswer,
  mapStringsAnswer,
} from './map';
import {
  createBooleanAnswerSchema,
  createFileAnswerSchema,
  createFilesAnswerSchema,
  createMultiNumbersAnswerSchema,
  createMultiStringsAnswerSchema,
  createNumberAnswerSchema,
  createNumbersAnswerSchema,
  createStringAnswerSchema,
  createStringsAnswerSchema,
} from './validate';

export const createCreateAnswer = <Config extends AnswerConfig>(
  type: Config['type'],
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await context.models.Answer.create(
    createAnswerDoc({
      type,
      input: args.input,
    } as CreateAnswerDocConfig),
  );

  const questionDoc = (await context.models.Question.findOneAndUpdate(
    { _id: args.input.questionId },
    { answer: doc._id },
    { new: true },
  ).populate('questionnaire')) as DocumentType<
    Omit<QuestionClass, 'questionnaire'> & {
      questionnaire: DocumentType<QuestionnaireClass>;
    }
  >;

  if (!questionDoc) {
    throw new ApolloError('Question not found.');
  }

  // * if the user is not permitted to perform this action the transaction is never going to be committed
  if (
    !(
      (context.user.role === AdminRole.admin &&
        context.user.company.id ===
          String(questionDoc.questionnaire.company)) ||
      context.user.id === String(questionDoc.questionnaire.user)
    )
  ) {
    throw new Forbidden();
  }

  await session.commitTransaction();

  session.endSession();

  const output = map(context.models)(doc);

  return output;
};

export const createUpdateAnswer = <Config extends UpdateAnswerConfig>(
  schema: Config['schema'],
  map: Config['map'],
) => async (
  _: never,
  args: {
    input: Config['input'];
  },
  context: Context,
): Promise<Config['output']> => {
  await schema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const doc = (await context.models.Answer.findOneAndUpdate(
    {
      _id: args.input.id,
    },
    { answer: args.input.answer },
    { new: true },
  ).populate({
    path: 'question',
    populate: 'questionnaire',
  })) as Nullable<
    DocumentType<Omit<AnswerClass, 'question'>> & {
      question: DocumentType<Omit<QuestionClass, 'questionnaire'>> & {
        questionnaire: DocumentType<QuestionnaireClass>;
      };
    }
  >;

  if (!doc) {
    throw new NotFoundError();
  }

  if (
    context.user.id !== String(doc.question.questionnaire.user) ||
    !(
      context.user.role === AdminRole.admin &&
      context.user.company.id === String(doc.question.questionnaire.company)
    )
  ) {
    throw new Forbidden();
  }

  const output = map(context.models)(doc);

  return output;
};

export const answerMutation = {
  createBooleanAnswer: createCreateAnswer<BooleanAnswerConfig>(
    'boolean',
    createBooleanAnswerSchema,
    mapBooleanAnswer,
  ),
  createStringAnswer: createCreateAnswer<StringAnswerConfig>(
    'string',
    createStringAnswerSchema,
    mapStringAnswer,
  ),
  createStringsAnswer: createCreateAnswer<StringsAnswerConfig>(
    'strings',
    createStringsAnswerSchema,
    mapStringsAnswer,
  ),
  createMultiStringsAnswer: createCreateAnswer<MultiStringsAnswerConfig>(
    'multiStrings',
    createMultiStringsAnswerSchema,
    mapMultiStringsAnswer,
  ),
  createNumberAnswer: createCreateAnswer<NumberAnswerConfig>(
    'number',
    createNumberAnswerSchema,
    mapNumberAnswer,
  ),
  createNumbersAnswer: createCreateAnswer<NumbersAnswerConfig>(
    'numbers',
    createNumbersAnswerSchema,
    mapNumbersAnswer,
  ),
  createMultiNumbersAnswer: createCreateAnswer<MultiNumbersAnswerConfig>(
    'multiNumbers',
    createMultiNumbersAnswerSchema,
    mapMultiNumbersAnswer,
  ),
  createFileAnswer: createCreateAnswer<FileAnswerConfig>(
    'file',
    createFileAnswerSchema,
    mapFileAnswer,
  ),
  createFilesAnswer: createCreateAnswer<FilesAnswerConfig>(
    'files',
    createFilesAnswerSchema,
    mapFilesAnswer,
  ),

  updateBooleanAnswer: createUpdateAnswer<BooleanAnswerUpdateConfig>(
    createBooleanAnswerSchema,
    mapBooleanAnswer,
  ),
  updateStringAnswer: createUpdateAnswer<StringAnswerUpdateConfig>(
    createStringAnswerSchema,
    mapStringAnswer,
  ),
  updateStringsAnswer: createUpdateAnswer<StringsAnswerUpdateConfig>(
    createStringsAnswerSchema,
    mapStringsAnswer,
  ),
  updateMultiStringsAnswer: createUpdateAnswer<MultiStringsAnswerUpdateConfig>(
    createMultiStringsAnswerSchema,
    mapMultiStringsAnswer,
  ),
  updateNumberAnswer: createUpdateAnswer<NumberAnswerUpdateConfig>(
    createNumberAnswerSchema,
    mapNumberAnswer,
  ),
  updateNumbersAnswer: createUpdateAnswer<NumbersAnswerUpdateConfig>(
    createNumbersAnswerSchema,
    mapNumbersAnswer,
  ),
  updateMultiNumbersAnswer: createUpdateAnswer<MultiNumbersAnswerUpdateConfig>(
    createMultiNumbersAnswerSchema,
    mapMultiNumbersAnswer,
  ),
  updateFileAnswer: createUpdateAnswer<FileAnswerUpdateConfig>(
    createFileAnswerSchema,
    mapFileAnswer,
  ),
  updateFilesAnswer: createUpdateAnswer<FilesAnswerUpdateConfig>(
    createFilesAnswerSchema,
    mapFilesAnswer,
  ),
};
