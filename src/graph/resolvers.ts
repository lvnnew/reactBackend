import {IGoodsService} from '../services/GoodsService';
import {IOrdersService} from '../services/OrdersService';
import {IPricesService} from '../services/PricesService';
import {IStoresService} from '../services/StoresService';
import {Service} from '../services/types';
import {Context} from './types';

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

    good(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IGoodsService>(Service.Goods).byId(args.id);
    },
    goods(_parent: any, _args: any, {container}: Context, _info: any) {
      return container.get<IGoodsService>(Service.Goods).list();
    },

    store(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IStoresService>(Service.Stores).byId(args.id);
    },
    stores(_parent: any, _args: any, {container}: Context, _info: any) {
      return container.get<IStoresService>(Service.Stores).list();
    },

    price(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IPricesService>(Service.Prices).byId(args.id);
    },
    prices(_parent: any, _args: any, {container}: Context, _info: any) {
      return container.get<IPricesService>(Service.Prices).list();
    },

    order(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IOrdersService>(Service.Orders).byId(args.id);
    },
    orders(_parent: any, _args: any, {container}: Context, _info: any) {
      return container.get<IOrdersService>(Service.Orders).list();
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

    addGood(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IGoodsService>(Service.Goods).create({
        title: args.title,
      });
    },
    async deleteGood(_parent: any, args: any, {container}: Context, _info: any) {
      await container.get<IGoodsService>(Service.Goods).del(args.id);
    },
    updateGood(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IGoodsService>(Service.Goods).update({
        id: args.id,
        title: args.title,
      });
    },

    addStore(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IStoresService>(Service.Stores).create({
        title: args.title,
      });
    },
    async deleteStore(_parent: any, args: any, {container}: Context, _info: any) {
      await container.get<IStoresService>(Service.Stores).del(args.id);
    },
    updateStore(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IStoresService>(Service.Stores).update({
        id: args.id,
        title: args.title,
      });
    },

    addPrice(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IPricesService>(Service.Prices).create({
        goodId: args.goodId,
        storeId: args.storeId,
        amount: args.amount,
      });
    },
    async deletePrice(_parent: any, args: any, {container}: Context, _info: any) {
      await container.get<IPricesService>(Service.Prices).del(args.id);
    },
    updatePrice(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IPricesService>(Service.Prices).update({
        id: args.id,
        goodId: args.goodId,
        storeId: args.storeId,
        amount: args.amount,
      });
    },

    addOrder(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IOrdersService>(Service.Orders).create({
        goodId: args.goodId,
        storeId: args.storeId,
        quantity: args.quantity,
      });
    },
    async deleteOrder(_parent: any, args: any, {container}: Context, _info: any) {
      await container.get<IOrdersService>(Service.Orders).del(args.id);
    },
    updateOrder(_parent: any, args: any, {container}: Context, _info: any) {
      return container.get<IOrdersService>(Service.Orders).update({
        id: args.id,
        goodId: args.goodId,
        storeId: args.storeId,
        quantity: args.quantity,
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

export default resolvers;
