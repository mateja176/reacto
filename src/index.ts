import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { join } from 'path';
import resolvers from './features';
import { readSchemas } from './utils';

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
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    );
  });
})();
