import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import ormConfig from '../ormconfig';
import { UserResolver } from './features/users/UsersResolver';
import authChecker from './utils/authChecker';

dotenv.config();

(async () => {
  const configConnectionOptions = await getConnectionOptions();
  const connectionOptions = {
    ...configConnectionOptions,
    ...ormConfig, // * if the order is changed the options are overridden even if they are no specified in env
  } as ConnectionOptions;
  const connection = await createConnection(connectionOptions);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker,
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
