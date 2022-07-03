import {PrismaClient} from '@prisma/client';
import {ApolloServer, gql} from 'apollo-server-express';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
 
  scalar Void 

  type User {
    id: Int!
    name: String
    email: String!
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

  type Query {
    user(id: Int!): User
    users: [User!]!
    libraries: [Library]
  }
  type Mutation {
    addUser(name: String, email: String!): User
    deleteUser(id: Int!): Void
    updateUser(id: Int!, name: String, email: String!): User
  }
`;

interface Context {
  user: string,
  prisma: PrismaClient
}

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
    user(_parent: any, args: any, context: Context, _info: any) {
      return context.prisma.user.findUnique({where: {id: args.id}});
    },
    users(_parent: any, _args: any, context: Context, _info: any) {
      return context.prisma.user.findMany();
    },
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    },
  },

  Mutation: {
    addUser(_parent: any, args: any, context: Context, _info: any) {
      return context.prisma.user.create({data: {
        name: args.name,
        email: args.email,
      }});
    },
    async deleteUser(_parent: any, args: any, context: Context, _info: any) {
      await context.prisma.user.delete({where: {
        id: args.id,
      }});
    },
    updateUser(_parent: any, args: any, context: Context, _info: any) {
      return context.prisma.user.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.name,
          email: args.email,
        },
      });
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
    }),
  });
};

export default createApolloServer;
