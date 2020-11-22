import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema, ResolverData } from 'type-graphql';
import Container from 'typedi';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import ormConfig from './config/ormConfig';
import { UserResolver } from './features/users/UsersResolver';
import { Context } from './interfaces/interfaces';
import authChecker from './utils/authChecker';

dotenv.config();

(async () => {
  const configConnectionOptions = await getConnectionOptions();
  const connectionOptions = {
    ...ormConfig,
    ...configConnectionOptions,
  } as ConnectionOptions;
  const connection = await createConnection(connectionOptions);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker,
    container: ({ context }: ResolverData<Context>) =>
      Container.of(context.connection),
  });

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
