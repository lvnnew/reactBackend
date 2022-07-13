import {PrismaClient} from '@prisma/client';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {Service} from './types';

export interface Price {
  id: number,
  goodId: number,
  storeId: number,
  amount: number,
}

export interface IPricesService {
  list: () => Promise<Price[]>,
  getPrice: (goodId: number, storeId: number) => Promise<number>,
  create: (price: Omit<Price, 'id'>) => Promise<Price>,
  update: (price: Price) => Promise<Price>,
  byId: (id: number) => Promise<Price | null>,
  del: (id: number) => Promise<void>,
}

@injectable()
class PricesService implements IPricesService {
  private prisma: PrismaClient;

  constructor(@inject(Service.Prisma) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  list = () => this.prisma.price.findMany();

  create = (price: Omit<Price, 'id'>) => {
    return this.prisma.price.create({data: price});
  };

  update = (price: Price) => {
    return this.prisma.price.update({
      where: {
        id: price.id,
      },
      data: price,
    });
  };

  byId = (id: number) => this.prisma.price.findUnique({where: {id}});

  del = async (id: number) => {
    await this.prisma.price.delete({where: {id}});
  };

  getPrice = async (goodId: number, storeId: number) => {
    return (await this.prisma.price.findFirst({where: {goodId, storeId}}))?.amount ?? 0;
  };
}

export default PricesService;
