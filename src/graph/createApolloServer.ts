import {PrismaClient} from '@prisma/client';
import {ApolloServer} from 'apollo-server-express';
import container from '../services/container';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import 'reflect-metadata';

const createApolloServer = (prisma: PrismaClient) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    context: ({req}) => ({
      user: req.headers.user,
      prisma,
      container,
    }),
  });
};

export default createApolloServer;
