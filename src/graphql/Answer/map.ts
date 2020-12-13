import { DocumentType } from '@typegoose/typegoose';
import { AnswerClass } from '../../classes/Answer/Answer';
import { Answer } from '../../generated/graphql';
import { mapDoc } from '../../utils/map';
import { createFindQuestion } from '../../utils/query';
import { mapQuestion } from '../Question/map';

export const mapAnswer = (doc: DocumentType<AnswerClass>): Answer => {
  const {
    question,
    boolean,
    string,
    strings,
    multiStrings,
    number,
    numbers,
    multiNumbers,
    file,
    files,
    ...answerDoc
  } = mapDoc(doc);

  const answer = (boolean ??
    string ??
    strings ??
    multiStrings ??
    number ??
    numbers ??
    multiNumbers ??
    file ??
    files) as Answer['answer']; // * at least one answer must exist

  return {
    ...answerDoc,
    question: createFindQuestion(mapQuestion)(question),
    answer,
  };
};
