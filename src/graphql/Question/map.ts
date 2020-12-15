import { DocumentType } from '@typegoose/typegoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import {
  FileQuestion,
  FilesQuestion,
  MultiNumbersQuestion,
  MultiStringsQuestion,
  NumberQuestion,
  NumbersQuestion,
  Question,
  QuestionTemplate,
  StringQuestion,
  StringsQuestion,
  YesNoQuestion,
} from '../../generated/graphql';
import { MapClass, mapDoc } from '../../utils/map';
import {
  createFindAnswers,
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

export const mapQuestionTemplate = (
  doc: DocumentType<QuestionTemplateClass>,
): QuestionTemplate => {
  const { questionnaireConfiguration, ...questionTemplate } = mapDoc(doc);

  return {
    __typename: 'FileQuestionTemplate',
    ...questionTemplate,
    questionnaireConfiguration: createFindQuestionnaireConfiguration(
      mapQuestionnaireConfiguration,
    )(questionnaireConfiguration),
  };
};

export class InvalidQuestionError extends Error {
  constructor() {
    super('Invalid question.');
  }
}
type QuestionBase = Pick<
  Question,
  'id' | 'label' | 'name' | 'rule' | 'optional' | 'questionnaire'
>;
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
      answers: createFindAnswers(mapYesNoAnswer)(cls.answers),
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
      answers: createFindAnswers(mapStringAnswer)(cls.answers),
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
      options: cls.strings.value,
      answers: createFindAnswers(mapStringsAnswer)(cls.answers),
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
      options: cls.multiStrings.value,
      answers: createFindAnswers(mapMultiStringsAnswer)(cls.answers),
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
      answers: createFindAnswers(mapNumberAnswer)(cls.answers),
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
      options: cls.numbers.value,
      answers: createFindAnswers(mapNumbersAnswer)(cls.answers),
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
      options: cls.multiNumbers.value,
      answers: createFindAnswers(mapMultiNumbersAnswer)(cls.answers),
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
      answers: createFindAnswers(mapFileAnswer)(cls.answers),
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
      answers: createFindAnswers(mapFilesAnswer)(cls.answers),
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
