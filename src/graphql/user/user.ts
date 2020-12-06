import { User } from '../../entities/Company/entities/User/User';
import { QueryResolvers } from '../../generated/resolvers';
import { Context } from '../../interfaces/Context';
import { NotFoundError } from '../../utils/errors';

const user: QueryResolvers<Context>['user'] = async (parent, args, context) => {
  const company = await context.connection
    .getMongoRepository(User)
    .findOne({ where: { id: args.id } });

  if (company) {
    return company;
  } else {
    throw new NotFoundError(args.id);
  }
};

export default user;
