import {
  BooleanQuestion,
  BooleanQuestionTemplate,
  CreateBooleanQuestionInput,
  CreateBooleanQuestionTemplateInput,
  CreateFileQuestionInput,
  CreateFileQuestionTemplateInput,
  CreateFilesQuestionInput,
  CreateFilesQuestionTemplateInput,
  CreateMultiNumbersQuestionInput,
  CreateMultiNumbersQuestionTemplateInput,
  CreateMultiStringsQuestionInput,
  CreateMultiStringsQuestionTemplateInput,
  CreateNumberQuestionInput,
  CreateNumberQuestionTemplateInput,
  CreateNumbersQuestionInput,
  CreateNumbersQuestionTemplateInput,
  CreateStringQuestionInput,
  CreateStringQuestionTemplateInput,
  CreateStringsQuestionInput,
  CreateStringsQuestionTemplateInput,
  FileQuestion,
  FileQuestionTemplate,
  FilesQuestion,
  FilesQuestionTemplate,
  MultiNumbersQuestion,
  MultiNumbersQuestionTemplate,
  MultiStringsQuestion,
  MultiStringsQuestionTemplate,
  NumberQuestion,
  NumberQuestionTemplate,
  NumbersQuestion,
  NumbersQuestionTemplate,
  StringQuestion,
  StringQuestionTemplate,
  StringsQuestion,
  StringsQuestionTemplate,
  UpdateBooleanQuestionInput,
  UpdateFileQuestionInput,
  UpdateFilesQuestionInput,
  UpdateMultiNumbersQuestionInput,
  UpdateMultiStringsQuestionInput,
  UpdateNumberQuestionInput,
  UpdateNumbersQuestionInput,
  UpdateStringQuestionInput,
  UpdateStringsQuestionInput,
} from '../../generated/graphql';
import {
  mapBooleanQuestion,
  mapBooleanQuestionTemplate,
  mapFileQuestion,
  mapFileQuestionTemplate,
  mapFilesQuestion,
  mapFilesQuestionTemplate,
  mapMultiNumbersQuestion,
  mapMultiNumbersQuestionTemplate,
  mapMultiStringsQuestion,
  mapMultiStringsQuestionTemplate,
  mapNumberQuestion,
  mapNumberQuestionTemplate,
  mapNumbersQuestion,
  mapNumbersQuestionTemplate,
  mapStringQuestion,
  mapStringQuestionTemplate,
  mapStringsQuestion,
  mapStringsQuestionTemplate,
} from './map';
import {
  createBooleanQuestionSchema,
  createBooleanQuestionTemplateSchema,
  createFileQuestionSchema,
  createFileQuestionTemplateSchema,
  createFilesQuestionSchema,
  createFilesQuestionTemplateSchema,
  createMultiNumbersQuestionSchema,
  createMultiNumbersQuestionTemplateSchema,
  createMultiStringsQuestionSchema,
  createMultiStringsQuestionTemplateSchema,
  createNumberQuestionSchema,
  createNumberQuestionTemplateSchema,
  createNumbersQuestionSchema,
  createNumbersQuestionTemplateSchema,
  createStringsQuestionSchema,
  createStringsQuestionTemplateSchema,
  updateBooleanQuestionSchema,
  updateFileQuestionSchema,
  updateFilesQuestionSchema,
  updateMultiNumbersQuestionSchema,
  updateMultiStringsQuestionSchema,
  updateNumberQuestionSchema,
  updateNumbersQuestionSchema,
  updateStringsQuestionSchema,
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

export type BooleanQuestionConfig = {
  type: 'boolean';
  schema: typeof createBooleanQuestionSchema;
  map: typeof mapBooleanQuestion;
  input: CreateBooleanQuestionInput;
  output: BooleanQuestion;
};
export type StringQuestionConfig = {
  type: 'string';
  schema: typeof createStringsQuestionSchema;
  map: typeof mapStringQuestion;
  input: CreateStringQuestionInput;
  output: StringQuestion;
};
export type StringsQuestionConfig = {
  type: 'strings';
  schema: typeof createStringsQuestionSchema;
  map: typeof mapStringsQuestion;
  input: CreateStringsQuestionInput;
  output: StringsQuestion;
};
export type MultiStringsQuestionConfig = {
  type: 'multiStrings';
  schema: typeof createMultiStringsQuestionSchema;
  map: typeof mapMultiStringsQuestion;
  input: CreateMultiStringsQuestionInput;
  output: MultiStringsQuestion;
};
export type NumberQuestionConfig = {
  type: 'number';
  schema: typeof createNumberQuestionSchema;
  map: typeof mapNumberQuestion;
  input: CreateNumberQuestionInput;
  output: NumberQuestion;
};
export type NumbersQuestionConfig = {
  type: 'numbers';
  schema: typeof createNumbersQuestionSchema;
  map: typeof mapNumbersQuestion;
  input: CreateNumbersQuestionInput;
  output: NumbersQuestion;
};
export type MultiNumbersQuestionConfig = {
  type: 'multiNumbers';
  schema: typeof createMultiNumbersQuestionSchema;
  map: typeof mapMultiNumbersQuestion;
  input: CreateMultiNumbersQuestionInput;
  output: MultiNumbersQuestion;
};
export type FileQuestionConfig = {
  type: 'file';
  schema: typeof createFileQuestionSchema;
  map: typeof mapFileQuestion;
  input: CreateFileQuestionInput;
  output: FileQuestion;
};
export type FilesQuestionConfig = {
  type: 'files';
  schema: typeof createFilesQuestionSchema;
  map: typeof mapFilesQuestion;
  input: CreateFilesQuestionInput;
  output: FilesQuestion;
};

export type QuestionConfig =
  | BooleanQuestionConfig
  | StringQuestionConfig
  | StringsQuestionConfig
  | MultiStringsQuestionConfig
  | NumberQuestionConfig
  | NumbersQuestionConfig
  | MultiNumbersQuestionConfig
  | FileQuestionConfig
  | FilesQuestionConfig;

export type CreateQuestionDocConfig =
  | {
      type: 'boolean';
      input: CreateBooleanQuestionInput;
    }
  | {
      type: 'string';
      input: CreateStringQuestionInput;
    }
  | {
      type: 'strings';
      input: CreateStringsQuestionInput;
    }
  | {
      type: 'multiStrings';
      input: CreateMultiStringsQuestionInput;
    }
  | {
      type: 'number';
      input: CreateNumberQuestionInput;
    }
  | {
      type: 'numbers';
      input: CreateNumbersQuestionInput;
    }
  | {
      type: 'multiNumbers';
      input: CreateMultiNumbersQuestionInput;
    }
  | {
      type: 'file';
      input: CreateFileQuestionInput;
    }
  | {
      type: 'files';
      input: CreateFilesQuestionInput;
    };

export type BooleanUpdateQuestionConfig = {
  schema: typeof updateBooleanQuestionSchema;
  map: typeof mapBooleanQuestion;
  input: UpdateBooleanQuestionInput;
  output: BooleanQuestion;
};
export type StringUpdateQuestionConfig = {
  schema: typeof updateStringsQuestionSchema;
  map: typeof mapStringQuestion;
  input: UpdateStringQuestionInput;
  output: StringQuestion;
};
export type StringsUpdateQuestionConfig = {
  schema: typeof updateStringsQuestionSchema;
  map: typeof mapStringsQuestion;
  input: UpdateStringsQuestionInput;
  output: StringsQuestion;
};
export type MultiStringsUpdateQuestionConfig = {
  schema: typeof updateMultiStringsQuestionSchema;
  map: typeof mapMultiStringsQuestion;
  input: UpdateMultiStringsQuestionInput;
  output: MultiStringsQuestion;
};
export type NumberUpdateQuestionConfig = {
  schema: typeof updateNumberQuestionSchema;
  map: typeof mapNumberQuestion;
  input: UpdateNumberQuestionInput;
  output: NumberQuestion;
};
export type NumbersUpdateQuestionConfig = {
  schema: typeof updateNumbersQuestionSchema;
  map: typeof mapNumbersQuestion;
  input: UpdateNumbersQuestionInput;
  output: NumbersQuestion;
};
export type MultiNumbersUpdateQuestionConfig = {
  schema: typeof updateMultiNumbersQuestionSchema;
  map: typeof mapMultiNumbersQuestion;
  input: UpdateMultiNumbersQuestionInput;
  output: MultiNumbersQuestion;
};
export type FileUpdateQuestionConfig = {
  schema: typeof updateFileQuestionSchema;
  map: typeof mapFileQuestion;
  input: UpdateFileQuestionInput;
  output: FileQuestion;
};
export type FilesUpdateQuestionConfig = {
  schema: typeof updateFilesQuestionSchema;
  map: typeof mapFilesQuestion;
  input: UpdateFilesQuestionInput;
  output: FilesQuestion;
};

export type UpdateQuestionConfig =
  | BooleanUpdateQuestionConfig
  | StringUpdateQuestionConfig
  | StringsUpdateQuestionConfig
  | MultiStringsUpdateQuestionConfig
  | NumberUpdateQuestionConfig
  | NumbersUpdateQuestionConfig
  | MultiNumbersUpdateQuestionConfig
  | FileUpdateQuestionConfig
  | FilesUpdateQuestionConfig;
