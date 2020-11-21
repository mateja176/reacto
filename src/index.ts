import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import resolvers from './features';
import { readSchemas } from './utils/utils';

dotenv.config();

(async () => {
  const schemas = await readSchemas(join(__dirname, 'features'));

  const server = new ApolloServer({
    typeDefs: [DIRECTIVES, ...schemas],
    resolvers,
    playground: true,
  });

  const app = express();

  server.applyMiddleware({ app });

  const port = process.env.PORT ?? 4000;

  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
    );
  });
})();
