import { Resolvers } from '../generated/graphql';
import company from './company';

const resolvers: Resolvers = {
  Query: { company },
};

export default resolvers;
