import { Query } from '../../generated/graphql';
import {
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
import { mapCompany } from './map';

const company: Query['company'] = async (_, args, context) => {
  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.company.id !== args.id) {
    throw new Forbidden();
  }

  const companyDoc = await context.models.Company.findById(args.id);

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
