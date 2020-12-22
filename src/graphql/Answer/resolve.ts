import { DocumentType, mongoose } from '@typegoose/typegoose';
import { ApolloError } from 'apollo-server-express';
import { Context } from 'vm';
import { AnswerClass } from '../../classes/Answer/Answer';
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
  Nullable,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
  UpdateFileAnswerInput,
  UpdateFilesAnswerInput,
  UpdateMultiNumbersAnswerInput,
  UpdateMultiStringsAnswerInput,
  UpdateNumberAnswerInput,
  UpdateNumbersAnswerInput,
  UpdateStringAnswerInput,
  UpdateStringsAnswerInput,
  UpdateYesNoAnswerInput,
  YesNoAnswer,
} from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
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
  updateFileAnswerSchema,
  updateFilesAnswerSchema,
  updateMultiNumbersAnswerSchema,
  updateMultiStringsAnswerSchema,
  updateNumberAnswerSchema,
  updateNumbersAnswerSchema,
  updateStringsAnswerSchema,
  updateYesNoAnswerSchema,
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

  const doc = await context.models.Answer.create({
    ...answerBase,
    question: questionId,
  });

  const questionDoc = (await context.models.Question.findOneAndUpdate(
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

  const output = map(context.models)(doc);

  return output;
};

type YesNoAnswerUpdateConfig = [
  typeof updateYesNoAnswerSchema,
  typeof mapYesNoAnswer,
  UpdateYesNoAnswerInput,
  YesNoAnswer,
];
type StringAnswerUpdateConfig = [
  typeof updateStringsAnswerSchema,
  typeof mapStringAnswer,
  UpdateStringAnswerInput,
  StringAnswer,
];
type StringsAnswerUpdateConfig = [
  typeof updateStringsAnswerSchema,
  typeof mapStringsAnswer,
  UpdateStringsAnswerInput,
  StringsAnswer,
];
type MultiStringsAnswerUpdateConfig = [
  typeof updateMultiStringsAnswerSchema,
  typeof mapMultiStringsAnswer,
  UpdateMultiStringsAnswerInput,
  MultiStringsAnswer,
];
type NumberAnswerUpdateConfig = [
  typeof updateNumberAnswerSchema,
  typeof mapNumberAnswer,
  UpdateNumberAnswerInput,
  NumberAnswer,
];
type NumbersAnswerUpdateConfig = [
  typeof updateNumbersAnswerSchema,
  typeof mapNumbersAnswer,
  UpdateNumbersAnswerInput,
  NumbersAnswer,
];
type MultiNumbersAnswerUpdateConfig = [
  typeof updateMultiNumbersAnswerSchema,
  typeof mapMultiNumbersAnswer,
  UpdateMultiNumbersAnswerInput,
  MultiNumbersAnswer,
];
type FileAnswerUpdateConfig = [
  typeof updateFileAnswerSchema,
  typeof mapFileAnswer,
  UpdateFileAnswerInput,
  FileAnswer,
];
type FilesAnswerUpdateConfig = [
  typeof updateFilesAnswerSchema,
  typeof mapFilesAnswer,
  UpdateFilesAnswerInput,
  FilesAnswer,
];

export const createUpdateAnswer = <
  Config extends
    | YesNoAnswerUpdateConfig
    | StringAnswerUpdateConfig
    | StringsAnswerUpdateConfig
    | MultiStringsAnswerUpdateConfig
    | NumberAnswerUpdateConfig
    | NumbersAnswerUpdateConfig
    | MultiNumbersAnswerUpdateConfig
    | FileAnswerUpdateConfig
    | FilesAnswerUpdateConfig
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

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const doc = (await context.models.Answer.findOneAndUpdate(
    {
      _id: args.input.id,
    },
    { answer: args.input.answer },
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

  updateYesNoAnswer: createUpdateAnswer<YesNoAnswerUpdateConfig>(
    createYesNoAnswerSchema,
    mapYesNoAnswer,
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
