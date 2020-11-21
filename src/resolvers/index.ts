import { Config } from 'apollo-server-express';

const resolvers: Config['resolvers'] = {
  Query: {
    hello: (): string => 'Hello world!',
  },
};

export default resolvers;
