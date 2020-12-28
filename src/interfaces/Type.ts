export const questionTypes = [
  'boolean',
  'string',
  'strings',
  'multiStrings',
  'number',
  'numbers',
  'multiNumbers',
  'file',
  'files',
] as const;

export type QuestionTypes = typeof questionTypes;
export type QuestionType = QuestionTypes[number];

export const answerTypes = questionTypes;
export type AnswerTypes = typeof answerTypes;
export type AnswerType = AnswerTypes[number];
