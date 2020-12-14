import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import express from 'express';
import jwt from 'express-jwt';
import * as fs from 'fs-extra';
import mongoose from 'mongoose';
import { join } from 'path';
import 'reflect-metadata';
import { path } from './config/config';
import { jwtAlgorithm } from './config/jwt';
import { Context } from './Context';
import resolvers from './graphql';
import { JWTUser } from './interfaces/JWTUser';
import env from './services/env';

(async () => {
  await mongoose.connect(env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const schema = await fs.readFile(
    join(__dirname, 'generated', 'schema.graphql'),
    { encoding: 'utf-8' },
  );

  const server = new ApolloServer({
    // * https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options
    typeDefs: gql(schema),
    resolvers: (resolvers as unknown) as IResolvers,
    context: ({ req }) => {
      const context: Context = {
        user: (req as express.Request & { user?: JWTUser }).user ?? null,
      };
      return context;
    },
    playground: true,
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
