import {injectable} from 'inversify';
import 'reflect-metadata';
import {log} from '../log';

export interface Film {
  id: number,
  title: string,
  raiting: number,
}

export interface IFilmsService {
  list: () => Film[],
  create: (film: Omit<Film, 'id'>) => Film,
  update: (film: Film) => Film,
  byId: (id: number) => Film | undefined,
  del: (id: number) => void
}

@injectable()
class FilmsService implements IFilmsService {
  films: Film[] = [
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

  list = () => this.films;

  create = (film: Omit<Film, 'id'>) => {
    const maxId = Math.max(...this.films.map(film => film.id));
    const id = maxId + 1;

    this.films.push({
      ...film,
      id,
    });

    return this.byId(id) as Film;
  };

  update = (film: Film) => {
    log.info(this.films);
    log.info(film);
    this.films = this.films.map(
      curent => (curent.id === film.id ? film : curent),
    );
    log.info(this.films);

    return this.byId(film.id) as Film;
  };

  byId = (id: number) => this.films.find(film => film.id === id);

  del = (id: number) => {
    this.films = this.films.filter(film => film.id !== id);
  };
}

export default FilmsService;
