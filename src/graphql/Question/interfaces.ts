import {
  BooleanQuestionTemplate,
  CreateBooleanQuestionTemplateInput,
  CreateFileQuestionTemplateInput,
  CreateFilesQuestionTemplateInput,
  CreateMultiNumbersQuestionTemplateInput,
  CreateMultiStringsQuestionTemplateInput,
  CreateNumberQuestionTemplateInput,
  CreateNumbersQuestionTemplateInput,
  CreateStringQuestionTemplateInput,
  CreateStringsQuestionTemplateInput,
  FileQuestionTemplate,
  FilesQuestionTemplate,
  MultiNumbersQuestionTemplate,
  MultiStringsQuestionTemplate,
  NumberQuestionTemplate,
  NumbersQuestionTemplate,
  StringQuestionTemplate,
  StringsQuestionTemplate,
} from '../../generated/graphql';
import {
  mapBooleanQuestionTemplate,
  mapFileQuestionTemplate,
  mapFilesQuestionTemplate,
  mapMultiNumbersQuestionTemplate,
  mapMultiStringsQuestionTemplate,
  mapNumberQuestionTemplate,
  mapNumbersQuestionTemplate,
  mapStringQuestionTemplate,
  mapStringsQuestionTemplate,
} from './map';
import {
  createBooleanQuestionTemplateSchema,
  createFileQuestionTemplateSchema,
  createFilesQuestionTemplateSchema,
  createMultiNumbersQuestionTemplateSchema,
  createMultiStringsQuestionTemplateSchema,
  createNumberQuestionTemplateSchema,
  createNumbersQuestionTemplateSchema,
  createStringsQuestionTemplateSchema,
} from './validate';

export type BooleanQuestionTemplateConfig = {
  type: 'boolean';
  schema: typeof createBooleanQuestionTemplateSchema;
  map: typeof mapBooleanQuestionTemplate;
  input: CreateBooleanQuestionTemplateInput;
  output: BooleanQuestionTemplate;
};
export type StringQuestionTemplateConfig = {
  type: 'string';
  schema: typeof createStringsQuestionTemplateSchema;
  map: typeof mapStringQuestionTemplate;
  input: CreateStringQuestionTemplateInput;
  output: StringQuestionTemplate;
};
export type StringsQuestionTemplateConfig = {
  type: 'strings';
  schema: typeof createStringsQuestionTemplateSchema;
  map: typeof mapStringsQuestionTemplate;
  input: CreateStringsQuestionTemplateInput;
  output: StringsQuestionTemplate;
};
export type MultiStringsQuestionTemplateConfig = {
  type: 'multiStrings';
  schema: typeof createMultiStringsQuestionTemplateSchema;
  map: typeof mapMultiStringsQuestionTemplate;
  input: CreateMultiStringsQuestionTemplateInput;
  output: MultiStringsQuestionTemplate;
};
export type NumberQuestionTemplateConfig = {
  type: 'number';
  schema: typeof createNumberQuestionTemplateSchema;
  map: typeof mapNumberQuestionTemplate;
  input: CreateNumberQuestionTemplateInput;
  output: NumberQuestionTemplate;
};
export type NumbersQuestionTemplateConfig = {
  type: 'numbers';
  schema: typeof createNumbersQuestionTemplateSchema;
  map: typeof mapNumbersQuestionTemplate;
  input: CreateNumbersQuestionTemplateInput;
  output: NumbersQuestionTemplate;
};
export type MultiNumbersQuestionTemplateConfig = {
  type: 'multiNumbers';
  schema: typeof createMultiNumbersQuestionTemplateSchema;
  map: typeof mapMultiNumbersQuestionTemplate;
  input: CreateMultiNumbersQuestionTemplateInput;
  output: MultiNumbersQuestionTemplate;
};
export type FileQuestionTemplateConfig = {
  type: 'file';
  schema: typeof createFileQuestionTemplateSchema;
  map: typeof mapFileQuestionTemplate;
  input: CreateFileQuestionTemplateInput;
  output: FileQuestionTemplate;
};
export type FilesQuestionTemplateConfig = {
  type: 'files';
  schema: typeof createFilesQuestionTemplateSchema;
  map: typeof mapFilesQuestionTemplate;
  input: CreateFilesQuestionTemplateInput;
  output: FilesQuestionTemplate;
};

export type QuestionTemplateConfig =
  | BooleanQuestionTemplateConfig
  | StringQuestionTemplateConfig
  | StringsQuestionTemplateConfig
  | MultiStringsQuestionTemplateConfig
  | NumberQuestionTemplateConfig
  | NumbersQuestionTemplateConfig
  | MultiNumbersQuestionTemplateConfig
  | FileQuestionTemplateConfig
  | FilesQuestionTemplateConfig;

// * Pick-ing props from a union results in prop type flattening
// * hence creating a new union
export type CreateQuestionTemplateDocConfig =
  | {
      type: 'boolean';
      input: CreateBooleanQuestionTemplateInput;
    }
  | {
      type: 'string';
      input: CreateStringQuestionTemplateInput;
    }
  | {
      type: 'strings';
      input: CreateStringsQuestionTemplateInput;
    }
  | {
      type: 'multiStrings';
      input: CreateMultiStringsQuestionTemplateInput;
    }
  | {
      type: 'number';
      input: CreateNumberQuestionTemplateInput;
    }
  | {
      type: 'numbers';
      input: CreateNumbersQuestionTemplateInput;
    }
  | {
      type: 'multiNumbers';
      input: CreateMultiNumbersQuestionTemplateInput;
    }
  | {
      type: 'file';
      input: CreateFileQuestionTemplateInput;
    }
  | {
      type: 'files';
      input: CreateFilesQuestionTemplateInput;
    };
