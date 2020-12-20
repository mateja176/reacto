import {
  ApolloServer,
  gql,
  IResolvers,
  makeExecutableSchema,
} from 'apollo-server-express';
import express from 'express';
import jwt from 'express-jwt';
import { promises as fs } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';
import 'reflect-metadata';
import { endpoint, path } from './config/config';
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

  const executableSchema = makeExecutableSchema({
    typeDefs: gql(schema),
    resolvers: (resolvers as unknown) as IResolvers,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  const server = new ApolloServer({
    schema: executableSchema,
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

  app.listen({ port: env.port }, () => {
    console.log(`🚀 Server ready at ${endpoint}`);
  });
})();
