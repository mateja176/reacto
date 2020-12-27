import { DocumentType } from '@typegoose/typegoose';
import { CreateQuery } from 'mongoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import {
  BooleanQuestion,
  BooleanQuestionTemplate,
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
  Question,
  QuestionTemplate,
  StringQuestion,
  StringQuestionTemplate,
  StringsQuestion,
  StringsQuestionTemplate,
} from '../../generated/graphql';
import { Models } from '../../services/models';
import { MapClass, mapDoc } from '../../utils/map';
import { createFind } from '../../utils/query';
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
} from '../Answer/map';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';
import {
  CreateQuestionDocConfig,
  CreateQuestionTemplateDocConfig,
  UpdateQuestionDocConfig,
} from './interfaces';

export const createQuestionTemplateDoc = (
  config: CreateQuestionTemplateDocConfig,
): CreateQuery<QuestionTemplateClass> => {
  const {
    label,
    name,
    optional,
    rule,
    questionnaireConfigurationId,
  } = config.input;

  const questionBase = {
    label,
    name,
    optional,
    rule: rule ?? undefined,
    questionnaireConfiguration: questionnaireConfigurationId,
  };

  switch (config.type) {
    case 'boolean':
      return {
        ...questionBase,
        boolean: {
          default: config.input.default ?? undefined,
        },
      };
    case 'string':
      return {
        ...questionBase,
        string: {
          default: config.input.default ?? undefined,
        },
      };
    case 'strings':
      return {
        ...questionBase,
        strings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiStrings':
      return {
        ...questionBase,
        multiStrings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'number':
      return {
        ...questionBase,
        number: {
          default: config.input.default ?? undefined,
        },
      };
    case 'numbers':
      return {
        ...questionBase,
        numbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiNumbers':
      return {
        ...questionBase,
        multiNumbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'file':
      return {
        ...questionBase,
        file: {
          default: config.input.default ?? undefined,
        },
      };
    case 'files':
      return {
        ...questionBase,
        files: {
          default: config.input.default ?? undefined,
        },
      };
  }
};

export class InvalidQuestionTemplateError extends Error {
  constructor() {
    super('Invalid question template type.');
  }
}
type Base = Pick<Question, 'id' | 'label' | 'name' | 'rule' | 'optional'>;

type QuestionTemplateBase = Base &
  Pick<QuestionTemplate, 'questionnaireConfiguration'>;

export const mapQuestionTemplateDoc = <Q extends QuestionTemplate>(
  map: (base: QuestionTemplateBase, cls: MapClass<QuestionTemplateClass>) => Q,
) => (models: Models) => (doc: DocumentType<QuestionTemplateClass>): Q => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaireConfiguration } = cls;
  return map(
    {
      id,
      label,
      name,
      rule: rule ?? null,
      optional,
      questionnaireConfiguration: createFind({
        Model: models.QuestionnaireConfiguration,
        map: mapQuestionnaireConfiguration(models),
        ref: questionnaireConfiguration,
      }),
    },
    cls,
  );
};

const mapBooleanQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): BooleanQuestionTemplate => {
  if (cls.boolean) {
    return {
      __typename: 'BooleanQuestionTemplate',
      ...base,
      default: cls.boolean.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapBooleanQuestionTemplate = mapQuestionTemplateDoc(
  mapBooleanQuestionTemplateClass,
);
const mapStringQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): StringQuestionTemplate => {
  if (cls.string) {
    return {
      __typename: 'StringQuestionTemplate',
      ...base,
      default: cls.string.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapStringQuestionTemplate = mapQuestionTemplateDoc(
  mapStringQuestionTemplateClass,
);
const mapStringsQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): StringsQuestionTemplate => {
  if (cls.strings) {
    return {
      __typename: 'StringsQuestionTemplate',
      ...base,
      default: cls.strings.default ?? null,
      options: cls.strings.options,
      otherOptionsCount: cls.strings.otherOptionsCount,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapStringsQuestionTemplate = mapQuestionTemplateDoc(
  mapStringsQuestionTemplateClass,
);
const mapMultiStringsQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): MultiStringsQuestionTemplate => {
  if (cls.multiStrings) {
    return {
      __typename: 'MultiStringsQuestionTemplate',
      ...base,
      default: cls.multiStrings.default ?? null,
      options: cls.multiStrings.options,
      otherOptionsCount: cls.multiStrings.otherOptionsCount,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapMultiStringsQuestionTemplate = mapQuestionTemplateDoc(
  mapMultiStringsQuestionTemplateClass,
);
const mapNumberQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): NumberQuestionTemplate => {
  if (cls.number) {
    return {
      __typename: 'NumberQuestionTemplate',
      ...base,
      default: cls.number.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapNumberQuestionTemplate = mapQuestionTemplateDoc(
  mapNumberQuestionTemplateClass,
);
const mapNumbersQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): NumbersQuestionTemplate => {
  if (cls.numbers) {
    return {
      __typename: 'NumbersQuestionTemplate',
      ...base,
      default: cls.numbers.default ?? null,
      options: cls.numbers.options,
      otherOptionsCount: cls.numbers.otherOptionsCount,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapNumbersQuestionTemplate = mapQuestionTemplateDoc(
  mapNumbersQuestionTemplateClass,
);
const mapMultiNumbersQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): MultiNumbersQuestionTemplate => {
  if (cls.multiNumbers) {
    return {
      __typename: 'MultiNumbersQuestionTemplate',
      ...base,
      default: cls.multiNumbers.default ?? null,
      options: cls.multiNumbers.options,
      otherOptionsCount: cls.multiNumbers.otherOptionsCount,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapMultiNumbersQuestionTemplate = mapQuestionTemplateDoc(
  mapMultiNumbersQuestionTemplateClass,
);
const mapFileQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): FileQuestionTemplate => {
  if (cls.file) {
    return {
      __typename: 'FileQuestionTemplate',
      ...base,
      default: cls.file.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapFileQuestionTemplate = mapQuestionTemplateDoc(
  mapFileQuestionTemplateClass,
);
const mapFilesQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): FilesQuestionTemplate => {
  if (cls.files) {
    return {
      __typename: 'FilesQuestionTemplate',
      ...base,
      default: cls.files.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapFilesQuestionTemplate = mapQuestionTemplateDoc(
  mapFilesQuestionTemplateClass,
);

export const mapQuestionTemplate = (models: Models) => (
  doc: DocumentType<QuestionTemplateClass>,
): QuestionTemplate => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaireConfiguration } = cls;

  const base: QuestionTemplateBase = {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaireConfiguration: createFind({
      Model: models.QuestionnaireConfiguration,
      map: mapQuestionnaireConfiguration(models),
      ref: questionnaireConfiguration,
    }),
  };

  if (cls.boolean) {
    return mapBooleanQuestionTemplateClass(base, cls);
  } else if (cls.string) {
    return mapStringQuestionTemplateClass(base, cls);
  } else if (cls.strings) {
    return mapStringsQuestionTemplateClass(base, cls);
  } else if (cls.multiStrings) {
    return mapMultiStringsQuestionTemplateClass(base, cls);
  } else if (cls.number) {
    return mapNumberQuestionTemplateClass(base, cls);
  } else if (cls.numbers) {
    return mapNumbersQuestionTemplateClass(base, cls);
  } else if (cls.multiNumbers) {
    return mapMultiStringsQuestionTemplateClass(base, cls);
  } else if (cls.file) {
    return mapFileQuestionTemplateClass(base, cls);
  } else if (cls.files) {
    return mapFilesQuestionTemplateClass(base, cls);
  } else {
    throw new InvalidQuestionTemplateError();
  }
};

// QUESTION

export const createQuestionDoc = (
  config: CreateQuestionDocConfig,
): CreateQuery<QuestionClass> => {
  const { label, name, optional, rule, questionnaireId } = config.input;

  const questionBase = {
    label,
    name,
    optional,
    rule: rule ?? undefined,
    questionnaire: questionnaireId,
  };

  switch (config.type) {
    case 'boolean':
      return {
        ...questionBase,
        boolean: {
          default: config.input.default ?? undefined,
        },
      };
    case 'string':
      return {
        ...questionBase,
        string: {
          default: config.input.default ?? undefined,
        },
      };
    case 'strings':
      return {
        ...questionBase,
        strings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiStrings':
      return {
        ...questionBase,
        multiStrings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'number':
      return {
        ...questionBase,
        number: {
          default: config.input.default ?? undefined,
        },
      };
    case 'numbers':
      return {
        ...questionBase,
        numbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiNumbers':
      return {
        ...questionBase,
        multiNumbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'file':
      return {
        ...questionBase,
        file: {
          default: config.input.default ?? undefined,
        },
      };
    case 'files':
      return {
        ...questionBase,
        files: {
          default: config.input.default ?? undefined,
        },
      };
  }
};
export const createUpdateQuestionDoc = (
  config: UpdateQuestionDocConfig,
): Omit<QuestionClass, 'questionnaire'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, name, optional, rule } = config.input;

  const questionBase = {
    label,
    name,
    optional,
    rule: rule ?? undefined,
  };

  switch (config.type) {
    case 'boolean':
      return {
        ...questionBase,
        boolean: {
          default: config.input.default ?? undefined,
        },
      };
    case 'string':
      return {
        ...questionBase,
        string: {
          default: config.input.default ?? undefined,
        },
      };
    case 'strings':
      return {
        ...questionBase,
        strings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiStrings':
      return {
        ...questionBase,
        multiStrings: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'number':
      return {
        ...questionBase,
        number: {
          default: config.input.default ?? undefined,
        },
      };
    case 'numbers':
      return {
        ...questionBase,
        numbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'multiNumbers':
      return {
        ...questionBase,
        multiNumbers: {
          default: config.input.default ?? undefined,
          options: config.input.options,
          otherOptionsCount: config.input.otherOptionsCount,
        },
      };
    case 'file':
      return {
        ...questionBase,
        file: {
          default: config.input.default ?? undefined,
        },
      };
    case 'files':
      return {
        ...questionBase,
        files: {
          default: config.input.default ?? undefined,
        },
      };
  }
};

export class InvalidQuestionError extends Error {
  constructor() {
    super('Invalid question type.');
  }
}
export class UnknownQuestionError extends Error {
  constructor() {
    super('Unknown question type.');
  }
}

type QuestionBase = Base & Pick<Question, 'questionnaire'>;

const isQuestionDoc = (
  doc: DocumentType<QuestionClass> | MapClass<QuestionClass>,
): doc is DocumentType<QuestionClass> => '_id' in doc;

export const mapQuestionDoc = <Q extends Question>(
  map: (models: Models, base: QuestionBase, cls: MapClass<QuestionClass>) => Q,
) => (models: Models) => (
  doc: DocumentType<QuestionClass> | MapClass<QuestionClass>,
) => {
  const cls = isQuestionDoc(doc) ? mapDoc(doc) : doc;
  const { id, label, name, rule, optional, questionnaire } = cls;
  return map(
    models,
    {
      id,
      label,
      name,
      rule: rule ?? null,
      optional,
      questionnaire: createFind({
        Model: models.Questionnaire,
        map: mapQuestionnaire(models),
        ref: questionnaire,
      }),
    },
    cls,
  );
};

const mapBooleanQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): BooleanQuestion => {
  if (cls.boolean) {
    return {
      __typename: 'BooleanQuestion',
      ...base,
      default: cls.boolean.default ?? null,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapBooleanAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapBooleanQuestion = mapQuestionDoc(mapBooleanQuestionClass);

const mapStringQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): StringQuestion => {
  if (cls.string) {
    return {
      __typename: 'StringQuestion',
      ...base,
      default: cls.string.default ?? null,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapStringAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringQuestion = mapQuestionDoc(mapStringQuestionClass);

const mapStringsQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): StringsQuestion => {
  if (cls.strings) {
    return {
      __typename: 'StringsQuestion',
      ...base,
      default: cls.strings.default ?? null,
      options: cls.strings.options,
      otherOptionsCount: cls.strings.otherOptionsCount,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapStringsAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringsQuestion = mapQuestionDoc(mapStringsQuestionClass);

const mapMultiStringsQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): MultiStringsQuestion => {
  if (cls.multiStrings) {
    return {
      __typename: 'MultiStringsQuestion',
      ...base,
      default: cls.multiStrings.default ?? null,
      options: cls.multiStrings.options,
      otherOptionsCount: cls.multiStrings.otherOptionsCount,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapMultiStringsAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapMultiStringsQuestion = mapQuestionDoc(
  mapMultiStringsQuestionClass,
);

const mapNumberQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): NumberQuestion => {
  if (cls.number) {
    return {
      __typename: 'NumberQuestion',
      ...base,
      default: cls.number.default ?? null,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapNumberAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumberQuestion = mapQuestionDoc(mapNumberQuestionClass);

const mapNumbersQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): NumbersQuestion => {
  if (cls.numbers) {
    return {
      __typename: 'NumbersQuestion',
      ...base,
      default: cls.numbers.default ?? null,
      options: cls.numbers.options,
      otherOptionsCount: cls.numbers.otherOptionsCount,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapNumbersAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumbersQuestion = mapQuestionDoc(mapNumbersQuestionClass);

const mapMultiNumbersQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): MultiNumbersQuestion => {
  if (cls.multiNumbers) {
    return {
      __typename: 'MultiNumbersQuestion',
      ...base,
      default: cls.multiNumbers.default ?? null,
      options: cls.multiNumbers.options,
      otherOptionsCount: cls.multiNumbers.otherOptionsCount,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapMultiNumbersAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapMultiNumbersQuestion = mapQuestionDoc(
  mapMultiNumbersQuestionClass,
);

const mapFileQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): FileQuestion => {
  if (cls.file) {
    return {
      __typename: 'FileQuestion',
      ...base,
      default: cls.file.default ?? null,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapFileAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapFileQuestion = mapQuestionDoc(mapFileQuestionClass);

const mapFilesQuestionClass = (
  models: Models,
  base: QuestionBase,
  cls: MapClass<QuestionClass>,
): FilesQuestion => {
  if (cls.files) {
    return {
      __typename: 'FilesQuestion',
      ...base,
      default: cls.files.default ?? null,
      answer: cls.answer
        ? createFind({
            Model: models.Answer,
            map: mapFilesAnswer(models),
            ref: cls.answer,
          })
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapFilesQuestion = mapQuestionDoc(mapFilesQuestionClass);

export const mapQuestion = (models: Models) => (
  doc: DocumentType<QuestionClass>,
): Question => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaire } = cls;

  const base: QuestionBase = {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaire: createFind({
      Model: models.Questionnaire,
      map: mapQuestionnaire(models),
      ref: questionnaire,
    }),
  };

  if (cls.boolean) {
    return mapBooleanQuestionClass(models, base, cls);
  } else if (cls.string) {
    return mapStringQuestionClass(models, base, cls);
  } else if (cls.strings) {
    return mapStringsQuestionClass(models, base, cls);
  } else if (cls.multiStrings) {
    return mapMultiStringsQuestionClass(models, base, cls);
  } else if (cls.number) {
    return mapNumberQuestionClass(models, base, cls);
  } else if (cls.numbers) {
    return mapNumbersQuestionClass(models, base, cls);
  } else if (cls.multiNumbers) {
    return mapMultiNumbersQuestionClass(models, base, cls);
  } else if (cls.file) {
    return mapFileQuestionClass(models, base, cls);
  } else if (cls.files) {
    return mapFilesQuestionClass(models, base, cls);
  } else {
    throw new UnknownQuestionError();
  }
};
