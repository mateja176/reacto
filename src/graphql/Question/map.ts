import { DocumentType } from '@typegoose/typegoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import { Question, QuestionTemplate } from '../../generated/graphql';
import { mapDoc } from '../../utils/map';
import {
  createFindAnswers,
  createFindQuestionnaire,
  createFindQuestionnaireConfiguration,
} from '../../utils/query';
import { mapAnswer } from '../Answer/map';
import { mapQuestionnaire } from '../Questionnaire/map';
import { mapQuestionnaireConfiguration } from '../QuestionnaireConfiguration/map';

export const mapQuestionTemplate = (
  doc: DocumentType<QuestionTemplateClass>,
): QuestionTemplate => {
  const { questionnaireConfiguration, ...questionTemplate } = mapDoc(doc);

  return {
    ...questionTemplate,
    questionnaireConfiguration: createFindQuestionnaireConfiguration(
      mapQuestionnaireConfiguration,
    )(questionnaireConfiguration),
  };
};

export const mapQuestion = (doc: DocumentType<QuestionClass>): Question => {
  const {
    questionnaire,
    answers,
    rule,
    strings,
    multiStrings,
    numbers,
    multiNumbers,
    booleanDefault,
    stringDefault,
    numberDefault,
    fileDefault,
    filesDefault,
    ...question
  } = mapDoc(doc);

  const defaultValue = (booleanDefault ??
    stringDefault ??
    strings?.default ??
    multiStrings?.default ??
    numberDefault ??
    numbers?.default ??
    multiNumbers?.default ??
    fileDefault ??
    filesDefault) as Question['default']; // * at least one answer must exist

  const questionAnswers = createFindAnswers(mapAnswer)(answers);

  return {
    ...question,
    rule: rule ?? null,
    questionnaire: createFindQuestionnaire(mapQuestionnaire)(questionnaire),
    answers: questionAnswers,
    default: defaultValue,
  } as Question; // * casting because of answers
};
