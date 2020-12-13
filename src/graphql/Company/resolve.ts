import { ForbiddenError } from 'apollo-server-express';
import { Query } from '../../generated/graphql';
import { CompanyModel } from '../../services/models';
import { NotFoundError } from '../../utils/errors';
import { mapCompany } from './map';

const company: Query['company'] = async (_, args, context) => {
  if (context.user?.company.id !== args.id) {
    throw new ForbiddenError('Forbidden');
  }

  const companyDoc = await CompanyModel.findById(args.id);

  if (!companyDoc) {
    throw new NotFoundError();
  }

  const company = mapCompany(companyDoc);

  return company;
};

export const companyQuery = {
  company,
};

export const companyMutation = {};
