/* eslint-disable no-console */
import express from 'express';
import {log} from './log';
import {json} from 'body-parser';
import {ApolloServer, gql} from 'apollo-server-express';

// yarn ts-node-dev src/index.ts

const app = express();
app.use(json());
const port = process.env.PORT || 3000;
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

app.get('/', (_req, res) => {
  res.send({message: 'Hello Vladimir!'});
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

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
 
  type User {
    id: ID!
    name: String
  }

  type Library {
    branch: String!
    books: [Book]!
  }

  # A book has a title and author
  type Book {
    title: String!
    author: Author!
  }

  # An author has a name
  type Author {
    name: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    user(id: ID!): User
    libraries: [Library]
  }
`;

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet',
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
  },
];

const libraries = [
  {
    branch: 'downtown',
  },
  {
    branch: 'riverside',
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown',
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    user(_parent: any, args: any, context: any, _info: any) {
      console.log(context);
      return users.find(user => user.id === args.id);
    },
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    },
  },

  Library: {
    books(parent: any) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter(book => book.branch === parent.branch);
    },
  },
  Book: {

    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent: any) {
      return {
        name: parent.author,
      };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  introspection: true,
  context: ({req}) => ({
    user: req.headers.user,
  }),
});

server
  .start()
  .then(() => server.applyMiddleware({app, path: '/graph'}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

