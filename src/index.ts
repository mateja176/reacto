import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema, ResolverData } from 'type-graphql';
import Container from 'typedi';
import { createConnection } from 'typeorm';
import { UserResolver } from './features/users/UsersResolver';
import { Context } from './interfaces/interfaces';
import authChecker from './utils/authChecker';

dotenv.config();

(async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker,
    container: ({ context }: ResolverData<Context>) =>
      Container.of(context.connection),
  });

  const connection = await createConnection();

  const server = new ApolloServer({
    schema,
    playground: true,
    context: { connection },
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
