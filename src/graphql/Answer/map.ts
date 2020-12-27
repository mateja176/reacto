import { DocumentType } from '@typegoose/typegoose';
import { CreateQuery } from 'mongoose';
import { AnswerClass } from '../../classes/Answer/Answer';
import {
  Answer,
  BooleanAnswer,
  FileAnswer,
  FilesAnswer,
  MultiNumbersAnswer,
  MultiStringsAnswer,
  NumberAnswer,
  NumbersAnswer,
  StringAnswer,
  StringsAnswer,
} from '../../generated/graphql';
import { Models } from '../../services/models';
import { MapClass, mapDoc } from '../../utils/map';
import { createFind } from '../../utils/query';
import {
  mapBooleanQuestion,
  mapFileQuestion,
  mapFilesQuestion,
  mapMultiNumbersQuestion,
  mapMultiStringsQuestion,
  mapNumberQuestion,
  mapNumbersQuestion,
  mapStringQuestion,
  mapStringsQuestion,
} from '../Question/map';
import { CreateAnswerDocConfig } from './interfaces';

export const createAnswerDoc = (
  config: CreateAnswerDocConfig,
): CreateQuery<AnswerClass> => {
  const {
    input: { questionId },
  } = config;

  const answerBase = {
    question: questionId,
  };

  switch (config.type) {
    case 'boolean':
      return {
        ...answerBase,
        boolean: config.input.answer,
      };
    case 'string':
      return {
        ...answerBase,
        string: config.input.answer,
      };
    case 'strings':
      return {
        ...answerBase,
        strings: config.input.answer,
      };
    case 'multiStrings':
      return {
        ...answerBase,
        multiStrings: config.input.answer,
      };
    case 'number':
      return {
        ...answerBase,
        number: config.input.answer,
      };
    case 'numbers':
      return {
        ...answerBase,
        numbers: config.input.answer,
      };
    case 'multiNumbers':
      return {
        ...answerBase,
        multiNumbers: config.input.answer,
      };
    case 'file':
      return {
        ...answerBase,
        file: config.input.answer,
      };
    case 'files':
      return {
        ...answerBase,
        files: config.input.answer,
      };
  }
};

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
export const mapBooleanAnswer = mapAnswerDoc(
  (models, cls, base): BooleanAnswer => {
    const { question, boolean } = cls;

    if (boolean) {
      return {
        __typename: 'BooleanAnswer',
        ...base,
        question: createFind({
          Model: models.Question,
          map: mapBooleanQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapStringQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapStringsQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapMultiStringsQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapNumberQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapNumbersQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapMultiNumbersQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapFileQuestion(models),
          ref: question,
        }),
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
        question: createFind({
          Model: models.Question,
          map: mapFilesQuestion(models),
          ref: question,
        }),
        answer: files,
      };
    } else {
      throw new InvalidAnswerError();
    }
  },
);
