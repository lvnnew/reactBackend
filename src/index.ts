/* eslint-disable no-console */
import {json} from 'body-parser';
import createApolloServer from './graph/createApolloServer';
import {filmsRouter} from './rest/films';
import express from 'express';
import exitHook from 'exit-hook';
import container from './services/container';

// cross-env TOKEN=777 yarn ts-node-dev src/index.ts

const app = express();
app.use(json());
const port = process.env.PORT || 3000;

app.use('/films', filmsRouter);

app.get('/', (_req, res) => {
  res.send({message: 'Hello Vladimir!'});
});

async function start() {
  const server = createApolloServer();

  server
    .start()
    .then(() => server.applyMiddleware({app, path: '/graph'}));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

exitHook(() => {
  console.log('exitHook');
  container.unbindAll();
});

start()
  .catch((error) => {
    throw error;
  });
