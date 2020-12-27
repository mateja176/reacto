import {
  BooleanAnswer,
  CreateBooleanAnswerInput,
  CreateFileAnswerInput,
  CreateFilesAnswerInput,
  CreateMultiNumbersAnswerInput,
  CreateMultiStringsAnswerInput,
  CreateNumberAnswerInput,
  CreateNumbersAnswerInput,
  CreateStringAnswerInput,
  CreateStringsAnswerInput,
  FileAnswer,
  FilesAnswer,
  MultiNumbersAnswer,
  MultiStringsAnswer,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
} from '../../generated/graphql';
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
  createStringsAnswerSchema,
} from './validate';

export type BooleanAnswerConfig = {
  schema: typeof createBooleanAnswerSchema;
  map: typeof mapBooleanAnswer;
  input: CreateBooleanAnswerInput;
  output: BooleanAnswer;
};
export type StringAnswerConfig = {
  schema: typeof createStringsAnswerSchema;
  map: typeof mapStringAnswer;
  input: CreateStringAnswerInput;
  output: StringAnswer;
};
export type StringsAnswerConfig = {
  schema: typeof createStringsAnswerSchema;
  map: typeof mapStringsAnswer;
  input: CreateStringsAnswerInput;
  output: StringsAnswer;
};
export type MultiStringsAnswerConfig = {
  schema: typeof createMultiStringsAnswerSchema;
  map: typeof mapMultiStringsAnswer;
  input: CreateMultiStringsAnswerInput;
  output: MultiStringsAnswer;
};
export type NumberAnswerConfig = {
  schema: typeof createNumberAnswerSchema;
  map: typeof mapNumberAnswer;
  input: CreateNumberAnswerInput;
  output: NumberAnswer;
};
export type NumbersAnswerConfig = {
  schema: typeof createNumbersAnswerSchema;
  map: typeof mapNumbersAnswer;
  input: CreateNumbersAnswerInput;
  output: NumbersAnswer;
};
export type MultiNumbersAnswerConfig = {
  schema: typeof createMultiNumbersAnswerSchema;
  map: typeof mapMultiNumbersAnswer;
  input: CreateMultiNumbersAnswerInput;
  output: MultiNumbersAnswer;
};
export type FileAnswerConfig = {
  schema: typeof createFileAnswerSchema;
  map: typeof mapFileAnswer;
  input: CreateFileAnswerInput;
  output: FileAnswer;
};
export type FilesAnswerConfig = {
  schema: typeof createFilesAnswerSchema;
  map: typeof mapFilesAnswer;
  input: CreateFilesAnswerInput;
  output: FilesAnswer;
};

export type AnswerConfig =
  | BooleanAnswerConfig
  | StringAnswerConfig
  | StringsAnswerConfig
  | MultiStringsAnswerConfig
  | NumberAnswerConfig
  | NumbersAnswerConfig
  | MultiNumbersAnswerConfig
  | FileAnswerConfig
  | FilesAnswerConfig;
