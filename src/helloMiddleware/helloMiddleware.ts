/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import express from 'express';
import {log} from '../log';
import {json} from 'body-parser';

// cross-env TOKEN=777 yarn ts-node-dev src/helloMiddleware/helloMiddleware.ts

const app = express();
app.use(json());
const port = 3000;
let films = [
  {
    id: 1,
    title: 'Аватар',
    raiting: 9,
  },
  {
    id: 2,
    title: 'Форсаж',
    raiting: 7,
  },
  {
    id: 3,
    title: 'Книга Иллая',
    raiting: 10,
  },
];

// '/films'

// '/films' -> films()

// '/films' -> md1 -> md2 -> md3 -> md4 -> films()

app.use((_req, _res, next) => {
  const start = Date.now();
  next();
  console.log('mills: ', Date.now() - start);
});

app.use('/unautorized', (_req, res) => {
  res.status(401).send();
});

app.use('/films/:filmId', (req, res, next) => {
  console.log(req.headers);
  console.log(`TOKEN: ${process.env.TOKEN}`);
  if (req.headers.auth === process.env.TOKEN) {
    next();
  } else {
    res.status(401).send();
  }
});

app.use((_req, _res, next) => {
  console.log('md1 start');
  next();
  console.log('md1 finish');
});

app.use((_req, _res, next) => {
  console.log('md2 start');
  next();
  console.log('md2 finish');
});

app.get('/', (_req, res) => {
  res.send({message: 'Hello Damir!'});
});

app.get('/films', (_req, res) => {
  res.send(films);
});

app.get('/films/:filmId', (req, res) => {
  log.info(req.params);
  res.send(films.find(film => film.id === Number.parseInt(req.params.filmId, 10)));
});

app.post('/films', (req, res) => {
  log.info(req.body);
  const maxId = Math.max(...films.map(film => film.id));
  films.push({
    ...req.body,
    id: maxId + 1,
  });
  res.send(films);
});

app.delete('/films/:filmId', (req, res) => {
  log.info(req.params);
  films = films.filter(film => film.id !== Number.parseInt(req.params.filmId, 10));
  res.send(films);
});

app.put('/films/:filmId', (req, res) => {
  log.info(req.params);
  films = films.map(
    film => (film.id === Number.parseInt(req.params.filmId, 10) ? {
      ...req.body,
      id: film.id,
    } : film),
  );
  res.send(films);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

