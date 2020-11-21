import { Resolvers } from '../generated/resolvers';
import company from './company';

const resolvers: Resolvers = {
  Query: { ...company },
};

export default resolvers;
