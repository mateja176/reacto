import { DocumentType } from '@typegoose/typegoose';
import { AnswerClass } from '../../classes/Answer/Answer';
import {
  Answer,
  FileAnswer,
  FilesAnswer,
  MultiNumbersAnswer,
  MultiStringsAnswer,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
  YesNoAnswer,
} from '../../generated/graphql';
import { Models } from '../../services/models';
import { MapClass, mapDoc } from '../../utils/map';
import { createFind } from '../../utils/query';
import {
  mapFileQuestion,
  mapFilesQuestion,
  mapMultiNumbersQuestion,
  mapMultiStringsQuestion,
  mapNumberQuestion,
  mapNumbersQuestion,
  mapStringQuestion,
  mapStringsQuestion,
  mapYesNoQuestion,
} from '../Question/map';

export class InvalidAnswerError extends Error {
  constructor() {
    super('Invalid answer.');
  }
}

export const mapAnswerDoc = <A extends Answer>(
  map: (
    models: Models,
    cls: MapClass<AnswerClass>,
    answerBase: Pick<Answer, 'id'>,
  ) => A,
) => (models: Models) => (doc: DocumentType<AnswerClass>) => {
  const cls = mapDoc(doc);
  const { id } = cls;
  return map(models, cls, { id });
};
export const mapYesNoAnswer = mapAnswerDoc(
  (models, cls, base): YesNoAnswer => {
    const { question, boolean } = cls;

    if (boolean) {
      return {
        __typename: 'YesNoAnswer',
        ...base,
        question: createFind(models.Question)(mapYesNoQuestion(models))(
          question,
        ),
        answer: boolean,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapStringAnswer = mapAnswerDoc(
  (models, cls, base): StringAnswer => {
    const { question, string } = cls;

    if (string) {
      return {
        __typename: 'StringAnswer',
        ...base,
        question: createFind(models.Question)(mapStringQuestion(models))(
          question,
        ),
        answer: string,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapStringsAnswer = mapAnswerDoc(
  (models, cls, base): StringsAnswer => {
    const { question, strings } = cls;

    if (strings) {
      return {
        __typename: 'StringsAnswer',
        ...base,
        question: createFind(models.Question)(mapStringsQuestion(models))(
          question,
        ),
        answer: strings,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapMultiStringsAnswer = mapAnswerDoc(
  (models, cls, base): MultiStringsAnswer => {
    const { question, multiStrings } = cls;

    if (multiStrings) {
      return {
        __typename: 'MultiStringsAnswer',
        ...base,
        question: createFind(models.Question)(mapMultiStringsQuestion(models))(
          question,
        ),
        answer: multiStrings,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapNumberAnswer = mapAnswerDoc(
  (models, cls, base): NumberAnswer => {
    const { question, number } = cls;

    if (number) {
      return {
        __typename: 'NumberAnswer',
        ...base,
        question: createFind(models.Question)(mapNumberQuestion(models))(
          question,
        ),
        answer: number,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapNumbersAnswer = mapAnswerDoc(
  (models, cls, base): NumbersAnswer => {
    const { question, numbers } = cls;

    if (numbers) {
      return {
        __typename: 'NumbersAnswer',
        ...base,
        question: createFind(models.Question)(mapNumbersQuestion(models))(
          question,
        ),
        answer: numbers,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapMultiNumbersAnswer = mapAnswerDoc(
  (models, cls, base): MultiNumbersAnswer => {
    const { question, multiNumbers } = cls;

    if (multiNumbers) {
      return {
        __typename: 'MultiNumbersAnswer',
        ...base,
        question: createFind(models.Question)(mapMultiNumbersQuestion(models))(
          question,
        ),
        answer: multiNumbers,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapFileAnswer = mapAnswerDoc(
  (models, cls, base): FileAnswer => {
    const { question, file } = cls;

    if (file) {
      return {
        __typename: 'FileAnswer',
        ...base,
        question: createFind(models.Question)(mapFileQuestion(models))(
          question,
        ),
        answer: file,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapFilesAnswer = mapAnswerDoc(
  (models, cls, base): FilesAnswer => {
    const { question, files } = cls;

    if (files) {
      return {
        __typename: 'FilesAnswer',
        ...base,
        question: createFind(models.Question)(mapFilesQuestion(models))(
          question,
        ),
        answer: files,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
