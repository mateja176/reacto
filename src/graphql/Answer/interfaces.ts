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
  updateBooleanAnswerSchema,
  updateFileAnswerSchema,
  updateFilesAnswerSchema,
  updateMultiNumbersAnswerSchema,
  updateMultiStringsAnswerSchema,
  updateNumberAnswerSchema,
  updateNumbersAnswerSchema,
  updateStringsAnswerSchema,
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

export type BooleanAnswerUpdateConfig = {
  schema: typeof updateBooleanAnswerSchema;
  map: typeof mapBooleanAnswer;
  input: UpdateBooleanAnswerInput;
  output: BooleanAnswer;
};
export type StringAnswerUpdateConfig = {
  schema: typeof updateStringsAnswerSchema;
  map: typeof mapStringAnswer;
  input: UpdateStringAnswerInput;
  output: StringAnswer;
};
export type StringsAnswerUpdateConfig = {
  schema: typeof updateStringsAnswerSchema;
  map: typeof mapStringsAnswer;
  input: UpdateStringsAnswerInput;
  output: StringsAnswer;
};
export type MultiStringsAnswerUpdateConfig = {
  schema: typeof updateMultiStringsAnswerSchema;
  map: typeof mapMultiStringsAnswer;
  input: UpdateMultiStringsAnswerInput;
  output: MultiStringsAnswer;
};
export type NumberAnswerUpdateConfig = {
  schema: typeof updateNumberAnswerSchema;
  map: typeof mapNumberAnswer;
  input: UpdateNumberAnswerInput;
  output: NumberAnswer;
};
export type NumbersAnswerUpdateConfig = {
  schema: typeof updateNumbersAnswerSchema;
  map: typeof mapNumbersAnswer;
  input: UpdateNumbersAnswerInput;
  output: NumbersAnswer;
};
export type MultiNumbersAnswerUpdateConfig = {
  schema: typeof updateMultiNumbersAnswerSchema;
  map: typeof mapMultiNumbersAnswer;
  input: UpdateMultiNumbersAnswerInput;
  output: MultiNumbersAnswer;
};
export type FileAnswerUpdateConfig = {
  schema: typeof updateFileAnswerSchema;
  map: typeof mapFileAnswer;
  input: UpdateFileAnswerInput;
  output: FileAnswer;
};
export type FilesAnswerUpdateConfig = {
  schema: typeof updateFilesAnswerSchema;
  map: typeof mapFilesAnswer;
  input: UpdateFilesAnswerInput;
  output: FilesAnswer;
};

export type UpdateAnswerConfig =
  | BooleanAnswerUpdateConfig
  | StringAnswerUpdateConfig
  | StringsAnswerUpdateConfig
  | MultiStringsAnswerUpdateConfig
  | NumberAnswerUpdateConfig
  | NumbersAnswerUpdateConfig
  | MultiNumbersAnswerUpdateConfig
  | FileAnswerUpdateConfig
  | FilesAnswerUpdateConfig;
