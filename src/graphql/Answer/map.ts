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
import { MapClass, mapDoc } from '../../utils/map';
import { createFindQuestion } from '../../utils/query';
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
  map: (cls: MapClass<AnswerClass>, answerBase: Pick<Answer, 'id'>) => A,
) => (doc: DocumentType<AnswerClass>) => {
  const cls = mapDoc(doc);
  const { id } = cls;
  return map(cls, { id });
};
export const mapYesNoAnswer = mapAnswerDoc(
  (cls, base): YesNoAnswer => {
    const { question, boolean } = cls;

    if (boolean) {
      return {
        __typename: 'YesNoAnswer',
        ...base,
        question: createFindQuestion(mapYesNoQuestion)(question),
        answer: boolean,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapStringAnswer = mapAnswerDoc(
  (cls, base): StringAnswer => {
    const { question, string } = cls;

    if (string) {
      return {
        __typename: 'StringAnswer',
        ...base,
        question: createFindQuestion(mapStringQuestion)(question),
        answer: string,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapStringsAnswer = mapAnswerDoc(
  (cls, base): StringsAnswer => {
    const { question, strings } = cls;

    if (strings) {
      return {
        __typename: 'StringsAnswer',
        ...base,
        question: createFindQuestion(mapStringsQuestion)(question),
        answer: strings,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapMultiStringsAnswer = mapAnswerDoc(
  (cls, base): MultiStringsAnswer => {
    const { question, multiStrings } = cls;

    if (multiStrings) {
      return {
        __typename: 'MultiStringsAnswer',
        ...base,
        question: createFindQuestion(mapMultiStringsQuestion)(question),
        answer: multiStrings,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapNumberAnswer = mapAnswerDoc(
  (cls, base): NumberAnswer => {
    const { question, number } = cls;

    if (number) {
      return {
        __typename: 'NumberAnswer',
        ...base,
        question: createFindQuestion(mapNumberQuestion)(question),
        answer: number,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapNumbersAnswer = mapAnswerDoc(
  (cls, base): NumbersAnswer => {
    const { question, numbers } = cls;

    if (numbers) {
      return {
        __typename: 'NumbersAnswer',
        ...base,
        question: createFindQuestion(mapNumbersQuestion)(question),
        answer: numbers,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapMultiNumbersAnswer = mapAnswerDoc(
  (cls, base): MultiNumbersAnswer => {
    const { question, multiNumbers } = cls;

    if (multiNumbers) {
      return {
        __typename: 'MultiNumbersAnswer',
        ...base,
        question: createFindQuestion(mapMultiNumbersQuestion)(question),
        answer: multiNumbers,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapFileAnswer = mapAnswerDoc(
  (cls, base): FileAnswer => {
    const { question, file } = cls;

    if (file) {
      return {
        __typename: 'FileAnswer',
        ...base,
        question: createFindQuestion(mapFileQuestion)(question),
        answer: file,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
export const mapFilesAnswer = mapAnswerDoc(
  (cls, base): FilesAnswer => {
    const { question, files } = cls;

    if (files) {
      return {
        __typename: 'FilesAnswer',
        ...base,
        question: createFindQuestion(mapFilesQuestion)(question),
        answer: files,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
