import { Company } from '../../entities/Company/Company';
import { QueryResolvers } from '../../generated/resolvers';
import { Context } from '../../interfaces/Context';
import { NotFoundError } from '../../utils/errors';

const company: QueryResolvers<Context>['company'] = async (
  parent,
  args,
  context,
) => {
  const company = await context.connection
    .getMongoRepository(Company)
    .findOne({ where: { id: args.id } });

  if (company) {
    return company;
  } else {
    throw new NotFoundError(args.id);
  }
};

export default company;
