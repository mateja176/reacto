import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import jwt from 'express-jwt';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { path } from './config/config';
import { jwtAlgorithm } from './config/jwt';
import resolvers from './graphql';
import { UserOutput } from './graphql/company/graphql/user/types/types';
import { Context } from './interfaces/Context';
import env from './services/env';
import authChecker from './utils/authChecker';

(async () => {
  await mongoose.connect(env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ req }) => {
      const context: Context = {
        connection: mongoose.connection,
        user: (req as express.Request & { user: UserOutput }).user, // `req.user` comes from `express-jwt`
      };
      return context;
    },
    tracing: process.env.NODE_ENV !== 'production',
  });

  const app = express();

  app.use(
    path,
    jwt({
      secret: env.jwtSecret,
      credentialsRequired: false,
      algorithms: [jwtAlgorithm],
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
