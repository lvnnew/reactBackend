import {Router} from 'express';
import {log} from '../log';
import container from '../services/container';
import {IFilmsService} from '../services/FilmsService';
import {Service} from '../services/types';

export const filmsRouter = Router();

filmsRouter.get('/', (_req, res) => {
  res.send(container.get<IFilmsService>(Service.Films).list());
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
  res.send(container.get<IFilmsService>(Service.Films).byId(Number.parseInt(req.params.filmId, 10)));
});

filmsRouter.post('/', (req, res) => {
  log.info(req.body);
  res.send(container.get<IFilmsService>(Service.Films).create(req.body));
});

filmsRouter.delete('/:filmId', (req, res) => {
  // log.info(req.params);
  // log.info(Number.parseInt(req.params.filmId, 10));
  // log.info(container.get<IFilmsService>(Service.Films).list());
  container.get<IFilmsService>(Service.Films).del(Number.parseInt(req.params.filmId, 10));
  // log.info(container.get<IFilmsService>(Service.Films).list());
  res.send();
});

filmsRouter.put('/:filmId', (req, res) => {
  log.info(req.params);
  log.info(req.body);
  res.send(container.get<IFilmsService>(Service.Films).update({...req.body, id: Number.parseInt(req.params.filmId, 10)}));
});

