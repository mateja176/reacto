import { DocumentType } from '@typegoose/typegoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import {
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
  YesNoQuestion,
  YesNoQuestionTemplate,
} from '../../generated/graphql';
import { Models } from '../../services/models';
import { MapClass, mapDoc } from '../../utils/map';
import { createFind } from '../../utils/query';
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
} from '../Answer/map';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';

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
      questionnaireConfiguration: createFind(models.QuestionnaireConfiguration)(
        mapQuestionnaireConfiguration(models),
      )(questionnaireConfiguration),
    },
    cls,
  );
};

const mapYesNoQuestionTemplateClass = (
  base: QuestionTemplateBase,
  cls: MapClass<QuestionTemplateClass>,
): YesNoQuestionTemplate => {
  if (cls.boolean) {
    return {
      __typename: 'YesNoQuestionTemplate',
      ...base,
      default: cls.boolean.default ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapYesNoQuestionTemplate = mapQuestionTemplateDoc(
  mapYesNoQuestionTemplateClass,
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
      default: cls.numbers.default,
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
      default: cls.multiNumbers.default,
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
    questionnaireConfiguration: createFind(models.QuestionnaireConfiguration)(
      mapQuestionnaireConfiguration(models),
    )(questionnaireConfiguration),
  };

  if (cls.boolean) {
    return mapYesNoQuestionTemplateClass(base, cls);
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

export const mapQuestionDoc = <Q extends Question>(
  map: (models: Models, cls: MapClass<QuestionClass>, base: QuestionBase) => Q,
) => (models: Models) => (doc: DocumentType<QuestionClass>) => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaire } = cls;
  return map(models, cls, {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaire: createFind(models.Questionnaire)(mapQuestionnaire(models))(
      questionnaire,
    ),
  });
};

const mapYesNoQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): YesNoQuestion => {
  if (cls.boolean) {
    return {
      __typename: 'YesNoQuestion',
      ...base,
      default: cls.boolean.default ?? null,
      answer: cls.answer
        ? createFind(models.Answer)(mapYesNoAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapYesNoQuestion = mapQuestionDoc(mapYesNoQuestionClass);

const mapStringQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): StringQuestion => {
  if (cls.string) {
    return {
      __typename: 'StringQuestion',
      ...base,
      default: cls.string.default ?? null,
      answer: cls.answer
        ? createFind(models.Answer)(mapStringAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringQuestion = mapQuestionDoc(mapStringQuestionClass);

const mapStringsQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): StringsQuestion => {
  if (cls.strings) {
    return {
      __typename: 'StringsQuestion',
      ...base,
      default: cls.strings.default ?? null,
      options: cls.strings.options,
      answer: cls.answer
        ? createFind(models.Answer)(mapStringsAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringsQuestion = mapQuestionDoc(mapStringsQuestionClass);

const mapMultiStringsQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): MultiStringsQuestion => {
  if (cls.multiStrings) {
    return {
      __typename: 'MultiStringsQuestion',
      ...base,
      default: cls.multiStrings.default ?? null,
      options: cls.multiStrings.options,
      answer: cls.answer
        ? createFind(models.Answer)(mapMultiStringsAnswer(models))(cls.answer)
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
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): NumberQuestion => {
  if (cls.number) {
    return {
      __typename: 'NumberQuestion',
      ...base,
      default: cls.number.default ?? null,
      answer: cls.answer
        ? createFind(models.Answer)(mapNumberAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumberQuestion = mapQuestionDoc(mapNumberQuestionClass);

const mapNumbersQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): NumbersQuestion => {
  if (cls.numbers) {
    return {
      __typename: 'NumbersQuestion',
      ...base,
      default: cls.numbers.default ?? null,
      options: cls.numbers.options,
      answer: cls.answer
        ? createFind(models.Answer)(mapNumbersAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumbersQuestion = mapQuestionDoc(mapNumbersQuestionClass);

const mapMultiNumbersQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): MultiNumbersQuestion => {
  if (cls.multiNumbers) {
    return {
      __typename: 'MultiNumbersQuestion',
      ...base,
      default: cls.multiNumbers.default ?? null,
      options: cls.multiNumbers.options,
      answer: cls.answer
        ? createFind(models.Answer)(mapMultiNumbersAnswer(models))(cls.answer)
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
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): FileQuestion => {
  if (cls.file) {
    return {
      __typename: 'FileQuestion',
      ...base,
      default: cls.file.default ?? null,
      answer: cls.answer
        ? createFind(models.Answer)(mapFileAnswer(models))(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapFileQuestion = mapQuestionDoc(mapFileQuestionClass);

const mapFilesQuestionClass = (
  models: Models,
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): FilesQuestion => {
  if (cls.files) {
    return {
      __typename: 'FilesQuestion',
      ...base,
      default: cls.files.default ?? null,
      answer: cls.answer
        ? createFind(models.Answer)(mapFilesAnswer(models))(cls.answer)
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
    questionnaire: createFind(models.Questionnaire)(mapQuestionnaire(models))(
      questionnaire,
    ),
  };

  if (cls.boolean) {
    return mapYesNoQuestionClass(models, cls, base);
  } else if (cls.string) {
    return mapStringQuestionClass(models, cls, base);
  } else if (cls.strings) {
    return mapStringsQuestionClass(models, cls, base);
  } else if (cls.multiStrings) {
    return mapMultiStringsQuestionClass(models, cls, base);
  } else if (cls.number) {
    return mapNumberQuestionClass(models, cls, base);
  } else if (cls.numbers) {
    return mapNumbersQuestionClass(models, cls, base);
  } else if (cls.multiNumbers) {
    return mapMultiNumbersQuestionClass(models, cls, base);
  } else if (cls.file) {
    return mapFileQuestionClass(models, cls, base);
  } else if (cls.files) {
    return mapFilesQuestionClass(models, cls, base);
  } else {
    throw new UnknownQuestionError();
  }
};
