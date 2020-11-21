import { Resolvers } from '../generated/resolvers';
import { Context } from '../interfaces/interfaces';
import company from './company';

const resolvers: Resolvers<Context> = {
  Query: { ...company },
};

export default resolvers;
