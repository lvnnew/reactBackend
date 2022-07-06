import {Router} from 'express';
import {log} from '../log';

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

export const filmsRouter = Router();

filmsRouter.get('/', (_req, res) => {
  res.send(films);
});

filmsRouter.use('/:filmId', (req, res, next) => {
  log.info(req.headers);
  log.info(`TOKEN: ${process.env.TOKEN}`);
  if (req.headers.auth === process.env.TOKEN) {
    next();
  } else {
    res.status(401).send();
  }
});

filmsRouter.get('/:filmId', (req, res) => {
  log.info(req.params);
  res.send(films.find(film => film.id === Number.parseInt(req.params.filmId, 10)));
});

filmsRouter.post('/', (req, res) => {
  log.info(req.body);
  const maxId = Math.max(...films.map(film => film.id));
  films.push({
    ...req.body,
    id: maxId + 1,
  });
  res.send(films);
});

filmsRouter.delete('/:filmId', (req, res) => {
  log.info(req.params);
  films = films.filter(film => film.id !== Number.parseInt(req.params.filmId, 10));
  res.send(films);
});

filmsRouter.put('/:filmId', (req, res) => {
  log.info(req.params);
  films = films.map(
    film => (film.id === Number.parseInt(req.params.filmId, 10) ? {
      ...req.body,
      id: film.id,
    } : film),
  );
  res.send(films);
});

