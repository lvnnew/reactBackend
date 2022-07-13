import {PrismaClient} from '@prisma/client';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {Service} from './types';

export interface Good {
  id: number,
  title: string
}

export interface IGoodsService {
  list: () => Promise<Good[]>,
  create: (good: Omit<Good, 'id'>) => Promise<Good>,
  update: (good: Good) => Promise<Good>,
  byId: (id: number) => Promise<Good | null>,
  del: (id: number) => Promise<void>,
}

@injectable()
class GoodsService implements IGoodsService {
  private prisma: PrismaClient;

  constructor(@inject(Service.Prisma) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  list = () => this.prisma.good.findMany();

  create = (good: Omit<Good, 'id'>) => {
    return this.prisma.good.create({data: good});
  };

  update = (good: Good) => {
    return this.prisma.good.update({
      where: {
        id: good.id,
      },
      data: good,
    });
  };

  byId = (id: number) => this.prisma.good.findUnique({where: {id}});

  del = async (id: number) => {
    await this.prisma.good.delete({where: {id}});
  };
}

export default GoodsService;
