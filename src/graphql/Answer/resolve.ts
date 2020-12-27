import { DocumentType, mongoose } from '@typegoose/typegoose';
import { ApolloError } from 'apollo-server-express';
import { Context } from 'vm';
import { AnswerClass } from '../../classes/Answer/Answer';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import {
  AdminRole,
  BooleanAnswer,
  FileAnswer,
  FilesAnswer,
  MultiNumbersAnswer,
  MultiStringsAnswer,
  Nullable,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
  UpdateBooleanAnswerInput,
  UpdateFileAnswerInput,
  UpdateFilesAnswerInput,
  UpdateMultiNumbersAnswerInput,
  UpdateMultiStringsAnswerInput,
  UpdateNumberAnswerInput,
  UpdateNumbersAnswerInput,
  UpdateStringAnswerInput,
  UpdateStringsAnswerInput,
} from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
import {
  AnswerConfig,
  BooleanAnswerConfig,
  FileAnswerConfig,
  FilesAnswerConfig,
  MultiNumbersAnswerConfig,
  MultiStringsAnswerConfig,
  NumberAnswerConfig,
  NumbersAnswerConfig,
  StringAnswerConfig,
  StringsAnswerConfig,
} from './interfaces';
import {
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
  updateBooleanAnswerSchema,
  updateFileAnswerSchema,
  updateFilesAnswerSchema,
  updateMultiNumbersAnswerSchema,
  updateMultiStringsAnswerSchema,
  updateNumberAnswerSchema,
  updateNumbersAnswerSchema,
  updateStringsAnswerSchema,
} from './validate';

export const createCreateAnswer = <Config extends AnswerConfig>(
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
    { _id: questionId },
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

type BooleanAnswerUpdateConfig = {
  schema: typeof updateBooleanAnswerSchema;
  map: typeof mapBooleanAnswer;
  input: UpdateBooleanAnswerInput;
  output: BooleanAnswer;
};
type StringAnswerUpdateConfig = {
  schema: typeof updateStringsAnswerSchema;
  map: typeof mapStringAnswer;
  input: UpdateStringAnswerInput;
  output: StringAnswer;
};
type StringsAnswerUpdateConfig = {
  schema: typeof updateStringsAnswerSchema;
  map: typeof mapStringsAnswer;
  input: UpdateStringsAnswerInput;
  output: StringsAnswer;
};
type MultiStringsAnswerUpdateConfig = {
  schema: typeof updateMultiStringsAnswerSchema;
  map: typeof mapMultiStringsAnswer;
  input: UpdateMultiStringsAnswerInput;
  output: MultiStringsAnswer;
};
type NumberAnswerUpdateConfig = {
  schema: typeof updateNumberAnswerSchema;
  map: typeof mapNumberAnswer;
  input: UpdateNumberAnswerInput;
  output: NumberAnswer;
};
type NumbersAnswerUpdateConfig = {
  schema: typeof updateNumbersAnswerSchema;
  map: typeof mapNumbersAnswer;
  input: UpdateNumbersAnswerInput;
  output: NumbersAnswer;
};
type MultiNumbersAnswerUpdateConfig = {
  schema: typeof updateMultiNumbersAnswerSchema;
  map: typeof mapMultiNumbersAnswer;
  input: UpdateMultiNumbersAnswerInput;
  output: MultiNumbersAnswer;
};
type FileAnswerUpdateConfig = {
  schema: typeof updateFileAnswerSchema;
  map: typeof mapFileAnswer;
  input: UpdateFileAnswerInput;
  output: FileAnswer;
};
type FilesAnswerUpdateConfig = {
  schema: typeof updateFilesAnswerSchema;
  map: typeof mapFilesAnswer;
  input: UpdateFilesAnswerInput;
  output: FilesAnswer;
};

export const createUpdateAnswer = <
  Config extends
    | BooleanAnswerUpdateConfig
    | StringAnswerUpdateConfig
    | StringsAnswerUpdateConfig
    | MultiStringsAnswerUpdateConfig
    | NumberAnswerUpdateConfig
    | NumbersAnswerUpdateConfig
    | MultiNumbersAnswerUpdateConfig
    | FileAnswerUpdateConfig
    | FilesAnswerUpdateConfig
>(
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
    createBooleanAnswerSchema,
    mapBooleanAnswer,
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
