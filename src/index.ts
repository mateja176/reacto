import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import * as fs from 'fs';
import { join } from 'path';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs: gql`
    ${fs.readFileSync(join(__dirname, '/graphql/schema.graphql'))}
  `,
  resolvers,
  playground: true,
});

const app = express();

server.applyMiddleware({ app });

const port = process.env.PORT ?? 4000;

app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
