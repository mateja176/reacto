import { Query } from '../../generated/graphql';
import { NotAuthenticatedError, NotFoundError } from '../../utils/errors';
import { mapCompany } from './map';

const company: Query['company'] = async (_, args, context) => {
  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  const companyDoc = await context.models.Company.findById(
    context.user.company.id,
  );

  if (!companyDoc) {
    throw new NotFoundError();
  }

  const company = mapCompany(context.models)(companyDoc);

  return company;
};

export const companyQuery = {
  company,
};

export const companyMutation = {};
