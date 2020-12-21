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
import { MapClass, mapDoc } from '../../utils/map';
import {
  createFindAnswer,
  createFindQuestionnaire,
  createFindQuestionnaireConfiguration,
} from '../../utils/query';
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
    super('Invalid question template.');
  }
}
type Base = Pick<Question, 'id' | 'label' | 'name' | 'rule' | 'optional'>;

type QuestionTemplateBase = Base &
  Pick<QuestionTemplate, 'questionnaireConfiguration'>;

export const mapQuestionTemplateDoc = <Q extends QuestionTemplate>(
  map: (cls: MapClass<QuestionTemplateClass>, base: QuestionTemplateBase) => Q,
) => (doc: DocumentType<QuestionTemplateClass>): Q => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaireConfiguration } = cls;
  return map(cls, {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaireConfiguration: createFindQuestionnaireConfiguration(
      mapQuestionnaireConfiguration,
    )(questionnaireConfiguration),
  });
};

const mapYesNoQuestionTemplateClass = (
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
): YesNoQuestionTemplate => {
  if (cls.booleanDefault) {
    return {
      __typename: 'YesNoQuestionTemplate',
      ...base,
      default: cls.booleanDefault,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapYesNoQuestionTemplate = mapQuestionTemplateDoc(
  mapYesNoQuestionTemplateClass,
);
const mapStringQuestionTemplateClass = (
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
): StringQuestionTemplate => {
  if (cls.stringDefault) {
    return {
      __typename: 'StringQuestionTemplate',
      ...base,
      default: cls.stringDefault,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapStringQuestionTemplate = mapQuestionTemplateDoc(
  mapStringQuestionTemplateClass,
);
const mapStringsQuestionTemplateClass = (
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
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
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
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
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
): NumberQuestionTemplate => {
  if (cls.numberDefault) {
    return {
      __typename: 'NumberQuestionTemplate',
      ...base,
      default: cls.numberDefault,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapNumberQuestionTemplate = mapQuestionTemplateDoc(
  mapNumberQuestionTemplateClass,
);
const mapNumbersQuestionTemplateClass = (
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
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
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
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
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
): FileQuestionTemplate => {
  if (cls.fileDefault) {
    return {
      __typename: 'FileQuestionTemplate',
      ...base,
      default: cls.fileDefault ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapFileQuestionTemplate = mapQuestionTemplateDoc(
  mapFileQuestionTemplateClass,
);
const mapFilesQuestionTemplateClass = (
  cls: MapClass<QuestionTemplateClass>,
  base: QuestionTemplateBase,
): FilesQuestionTemplate => {
  if (cls.filesDefault) {
    return {
      __typename: 'FilesQuestionTemplate',
      ...base,
      default: cls.filesDefault ?? null,
    };
  } else {
    throw new InvalidQuestionTemplateError();
  }
};
export const mapFilesQuestionTemplate = mapQuestionTemplateDoc(
  mapFilesQuestionTemplateClass,
);

export const mapQuestionTemplate = (
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
    questionnaireConfiguration: createFindQuestionnaireConfiguration(
      mapQuestionnaireConfiguration,
    )(questionnaireConfiguration),
  };

  if (cls.booleanDefault) {
    return mapYesNoQuestionTemplateClass(cls, base);
  } else if (cls.stringDefault) {
    return mapStringQuestionTemplateClass(cls, base);
  } else if (cls.strings) {
    return mapStringsQuestionTemplateClass(cls, base);
  } else if (cls.multiStrings) {
    return mapMultiStringsQuestionTemplateClass(cls, base);
  } else if (cls.numberDefault) {
    return mapNumberQuestionTemplateClass(cls, base);
  } else if (cls.numbers) {
    return mapNumbersQuestionTemplateClass(cls, base);
  } else if (cls.multiNumbers) {
    return mapMultiStringsQuestionTemplateClass(cls, base);
  } else if (cls.fileDefault) {
    return mapFileQuestionTemplateClass(cls, base);
  } else if (cls.filesDefault) {
    return mapFilesQuestionTemplateClass(cls, base);
  } else {
    throw new InvalidQuestionError();
  }
};

// QUESTION

export class InvalidQuestionError extends Error {
  constructor() {
    super('Invalid question.');
  }
}

type QuestionBase = Base & Pick<Question, 'questionnaire'>;

export const mapQuestionDoc = <Q extends Question>(
  map: (cls: MapClass<QuestionClass>, base: QuestionBase) => Q,
) => (doc: DocumentType<QuestionClass>) => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaire } = cls;
  return map(cls, {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaire: createFindQuestionnaire(mapQuestionnaire)(questionnaire),
  });
};

const mapYesNoQuestionClass = (
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): YesNoQuestion => {
  if (cls.booleanDefault) {
    return {
      __typename: 'YesNoQuestion',
      ...base,
      default: cls.booleanDefault,
      answer: cls.answer ? createFindAnswer(mapYesNoAnswer)(cls.answer) : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapYesNoQuestion = mapQuestionDoc(mapYesNoQuestionClass);
const mapStringQuestionClass = (
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): StringQuestion => {
  if (cls.stringDefault) {
    return {
      __typename: 'StringQuestion',
      ...base,
      default: cls.stringDefault,
      answer: cls.answer ? createFindAnswer(mapStringAnswer)(cls.answer) : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringQuestion = mapQuestionDoc(mapStringQuestionClass);
const mapStringsQuestionClass = (
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
        ? createFindAnswer(mapStringsAnswer)(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapStringsQuestion = mapQuestionDoc(mapStringsQuestionClass);
const mapMultiStringsQuestionClass = (
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
        ? createFindAnswer(mapMultiStringsAnswer)(cls.answer)
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
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): NumberQuestion => {
  if (cls.numberDefault) {
    return {
      __typename: 'NumberQuestion',
      ...base,
      default: cls.numberDefault ?? null,
      answer: cls.answer ? createFindAnswer(mapNumberAnswer)(cls.answer) : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumberQuestion = mapQuestionDoc(mapNumberQuestionClass);
const mapNumbersQuestionClass = (
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
        ? createFindAnswer(mapNumbersAnswer)(cls.answer)
        : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapNumbersQuestion = mapQuestionDoc(mapNumbersQuestionClass);
const mapMultiNumbersQuestionClass = (
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
        ? createFindAnswer(mapMultiNumbersAnswer)(cls.answer)
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
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): FileQuestion => {
  if (cls.fileDefault) {
    return {
      __typename: 'FileQuestion',
      ...base,
      default: cls.fileDefault ?? null,
      answer: cls.answer ? createFindAnswer(mapFileAnswer)(cls.answer) : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapFileQuestion = mapQuestionDoc(mapFileQuestionClass);
const mapFilesQuestionClass = (
  cls: MapClass<QuestionClass>,
  base: QuestionBase,
): FilesQuestion => {
  if (cls.filesDefault) {
    return {
      __typename: 'FilesQuestion',
      ...base,
      default: cls.filesDefault ?? null,
      answer: cls.answer ? createFindAnswer(mapFilesAnswer)(cls.answer) : null,
    };
  } else {
    throw new InvalidQuestionError();
  }
};
export const mapFilesQuestion = mapQuestionDoc(mapFilesQuestionClass);

export const mapQuestion = (doc: DocumentType<QuestionClass>): Question => {
  const cls = mapDoc(doc);
  const { id, label, name, rule, optional, questionnaire } = cls;

  const base: QuestionBase = {
    id,
    label,
    name,
    rule: rule ?? null,
    optional,
    questionnaire: createFindQuestionnaire(mapQuestionnaire)(questionnaire),
  };

  if (cls.booleanDefault) {
    return mapYesNoQuestionClass(cls, base);
  } else if (cls.stringDefault) {
    return mapStringQuestionClass(cls, base);
  } else if (cls.strings) {
    return mapStringsQuestionClass(cls, base);
  } else if (cls.multiStrings) {
    return mapMultiStringsQuestionClass(cls, base);
  } else if (cls.numberDefault) {
    return mapNumberQuestionClass(cls, base);
  } else if (cls.numbers) {
    return mapNumbersQuestionClass(cls, base);
  } else if (cls.multiNumbers) {
    return mapMultiStringsQuestionClass(cls, base);
  } else if (cls.fileDefault) {
    return mapFileQuestionClass(cls, base);
  } else if (cls.filesDefault) {
    return mapFilesQuestionClass(cls, base);
  } else {
    throw new InvalidQuestionError();
  }
};
