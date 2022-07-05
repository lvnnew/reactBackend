/* eslint-disable no-console */
import {json} from 'body-parser';
import {PrismaClient} from '@prisma/client';
import createApolloServer from './graph/createApolloServer';
import {filmsRouter} from './rest/films';
import express from 'express';

// cross-env TOKEN=777 yarn ts-node-dev src/index.ts

const app = express();
app.use(json());
const port = process.env.PORT || 3000;

app.use('/films', filmsRouter);

app.get('/', (_req, res) => {
  res.send({message: 'Hello Vladimir!'});
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const prisma = new PrismaClient();

async function start() {
  const server = createApolloServer(prisma);

  server
    .start()
    .then(() => server.applyMiddleware({app, path: '/graph'}));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

start()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
