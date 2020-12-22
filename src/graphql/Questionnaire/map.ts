import { DocumentType, mongoose } from '@typegoose/typegoose';
import { QuestionClass } from '../../classes/Question/Question';
import { QuestionTemplateClass } from '../../classes/Question/QuestionTemplate';
import { QuestionnaireClass } from '../../classes/Questionnaire/Questionnaire';
import { Questionnaire } from '../../generated/graphql';
import { Models } from '../../services/models';
import { mapDoc } from '../../utils/map';
import { createFind, createFindMany } from '../../utils/query';
import { mapCompany } from '../Company/map';
import { mapQuestion } from '../Question/map';
import { mapUser } from '../User/map';

export const mapQuestionnaire = (models: Models) => (
  doc: DocumentType<QuestionnaireClass>,
): Questionnaire => {
  const {
    company,
    user,
    inheritedQuestions,
    questions,
    ...questionnaire
  } = mapDoc(doc);

  return {
    __typename: 'Questionnaire',
    ...questionnaire,
    company: createFind(models.Company)(mapCompany(models))(company),
    user: createFind(models.User)(mapUser(models))(user),
    inheritedQuestions: createFindMany(models.Question)(mapQuestion(models))(
      inheritedQuestions,
    ),
    questions: createFindMany(models.Question)(mapQuestion(models))(questions),
  };
};

export const questionTemplateToQuestion = (
  questionnaireId: mongoose.Types.ObjectId,
) => (
  doc: DocumentType<QuestionTemplateClass>,
): mongoose.CreateQuery<QuestionClass> => {
  return {
    name: doc.name,
    label: doc.label,
    optional: doc.optional,
    rule: doc.rule,
    questionnaire: questionnaireId,
    boolean: doc.boolean,
    string: doc.string,
    strings: doc.strings,
    multiStrings: doc.multiStrings,
    number: doc.number,
    numbers: doc.numbers,
    multiNumbers: doc.multiNumbers,
    file: doc.file,
    files: doc.files,
  };
};
