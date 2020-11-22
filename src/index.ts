import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema, ContainerType } from 'type-graphql';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import ormConfig from '../ormconfig';
import configureContainer from './container';
import resolvers from './resolvers';
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
    resolvers,
    authChecker,
    container: () => configureContainer(connection) as ContainerType,
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
