import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'express-jwt';
import 'reflect-metadata';
import { buildSchema, ContainerType } from 'type-graphql';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import ormConfig from '../ormconfig';
import { path } from './config/config';
import configureContainer from './container';
import { Context } from './interfaces/interfaces';
import { JWTUser } from './interfaces/jwt';
import resolvers from './resolvers';
import authChecker from './utils/authChecker';
import { EnvError } from './utils/errors';

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
    context: ({ req }) => {
      const context: Context = {
        connection,
        user: (req as express.Request & { user: JWTUser }).user, // `req.user` comes from `express-jwt`
      };
      return context;
    },
  });

  const app = express();

  if (!process.env.JWT_SECRET) {
    throw new EnvError('JWT_SECRET');
  }
  app.use(
    path,
    jwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false,
      algorithms: ['RS256'],
    }),
  );

  server.applyMiddleware({ app, path });

  const port = process.env.PORT ?? 4000;

  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
    );
  });
})();
