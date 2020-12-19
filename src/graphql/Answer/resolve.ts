import { DocumentType } from '@typegoose/typegoose';
import { ApolloError } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Context } from 'vm';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import {
  AdminRole,
  CreateFileAnswerInput,
  CreateFilesAnswerInput,
  CreateMultiNumbersAnswerInput,
  CreateMultiStringsAnswerInput,
  CreateNumberAnswerInput,
  CreateNumbersAnswerInput,
  CreateStringAnswerInput,
  CreateStringsAnswerInput,
  CreateYesNoAnswerInput,
  FileAnswer,
  FilesAnswer,
  MultiNumbersAnswer,
  MultiStringsAnswer,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
  YesNoAnswer,
} from '../../generated/graphql';
import { AnswerModel, QuestionModel } from '../../services/models';
import { Forbidden, NotAuthenticatedError } from '../../utils/errors';
import {
  mapFileAnswer,
  mapFilesAnswer,
  mapMultiNumbersAnswer,
  mapMultiStringsAnswer,
  mapNumberAnswer,
  mapNumbersAnswer,
  mapStringAnswer,
  mapStringsAnswer,
  mapYesNoAnswer,
} from './map';
import {
  createFileAnswerSchema,
  createFilesAnswerSchema,
  createMultiNumbersAnswerSchema,
  createMultiStringsAnswerSchema,
  createNumberAnswerSchema,
  createNumbersAnswerSchema,
  createStringAnswerSchema,
  createStringsAnswerSchema,
  createYesNoAnswerSchema,
} from './validate';

type YesNoAnswerConfig = [
  typeof createYesNoAnswerSchema,
  typeof mapYesNoAnswer,
  CreateYesNoAnswerInput,
  YesNoAnswer,
];
type StringAnswerConfig = [
  typeof createStringsAnswerSchema,
  typeof mapStringAnswer,
  CreateStringAnswerInput,
  StringAnswer,
];
type StringsAnswerConfig = [
  typeof createStringsAnswerSchema,
  typeof mapStringsAnswer,
  CreateStringsAnswerInput,
  StringsAnswer,
];
type MultiStringsAnswerConfig = [
  typeof createMultiStringsAnswerSchema,
  typeof mapMultiStringsAnswer,
  CreateMultiStringsAnswerInput,
  MultiStringsAnswer,
];
type NumberAnswerConfig = [
  typeof createNumberAnswerSchema,
  typeof mapNumberAnswer,
  CreateNumberAnswerInput,
  NumberAnswer,
];
type NumbersAnswerConfig = [
  typeof createNumbersAnswerSchema,
  typeof mapNumbersAnswer,
  CreateNumbersAnswerInput,
  NumbersAnswer,
];
type MultiNumbersAnswerConfig = [
  typeof createMultiNumbersAnswerSchema,
  typeof mapMultiNumbersAnswer,
  CreateMultiNumbersAnswerInput,
  MultiNumbersAnswer,
];
type FileAnswerConfig = [
  typeof createFileAnswerSchema,
  typeof mapFileAnswer,
  CreateFileAnswerInput,
  FileAnswer,
];
type FilesAnswerConfig = [
  typeof createFilesAnswerSchema,
  typeof mapFilesAnswer,
  CreateFilesAnswerInput,
  FilesAnswer,
];

export const createCreateAnswer = <
  Config extends
    | YesNoAnswerConfig
    | StringAnswerConfig
    | StringsAnswerConfig
    | MultiStringsAnswerConfig
    | NumberAnswerConfig
    | NumbersAnswerConfig
    | MultiNumbersAnswerConfig
    | FileAnswerConfig
    | FilesAnswerConfig
>(
  schema: Config[0],
  map: Config[1],
) => async (
  _: never,
  args: {
    input: Config[2];
  },
  context: Context,
): Promise<Config[3]> => {
  await schema.validateAsync(args.input);

  const {
    input: { questionId, ...answerBase },
  } = args;

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const doc = await AnswerModel.create({
    ...answerBase,
    question: questionId,
  });

  const questionDoc = (await QuestionModel.findOneAndUpdate(
    { _id: args.input.questionId },
    { answer: doc._id },
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
    context.user.id !== questionDoc.questionnaire.user ||
    !(
      context.user.role === AdminRole.admin &&
      context.user.company.id === String(questionDoc.questionnaire.company)
    )
  ) {
    throw new Forbidden();
  }

  await session.commitTransaction();

  session.endSession();

  const output = map(doc);

  return output;
};

export const answerMutation = {
  createYesNoAnswer: createCreateAnswer<YesNoAnswerConfig>(
    createYesNoAnswerSchema,
    mapYesNoAnswer,
  ),
  createStringAnswer: createCreateAnswer<StringAnswerConfig>(
    createStringAnswerSchema,
    mapStringAnswer,
  ),
  createStringsAnswer: createCreateAnswer<StringsAnswerConfig>(
    createStringsAnswerSchema,
    mapStringsAnswer,
  ),
  createMultiStringsAnswer: createCreateAnswer<MultiStringsAnswerConfig>(
    createMultiStringsAnswerSchema,
    mapMultiStringsAnswer,
  ),
  createNumberAnswer: createCreateAnswer<NumberAnswerConfig>(
    createNumberAnswerSchema,
    mapNumberAnswer,
  ),
  createNumbersAnswer: createCreateAnswer<NumbersAnswerConfig>(
    createNumbersAnswerSchema,
    mapNumbersAnswer,
  ),
  createMultiNumbersAnswer: createCreateAnswer<MultiNumbersAnswerConfig>(
    createMultiNumbersAnswerSchema,
    mapMultiNumbersAnswer,
  ),
  createFileAnswer: createCreateAnswer<FileAnswerConfig>(
    createFileAnswerSchema,
    mapFileAnswer,
  ),
  createFilesAnswer: createCreateAnswer<FilesAnswerConfig>(
    createFilesAnswerSchema,
    mapFilesAnswer,
  ),
};
