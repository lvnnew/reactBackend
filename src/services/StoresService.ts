import {PrismaClient} from '@prisma/client';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {Service} from './types';

export interface Store {
  id: number,
  title: string
}

export interface IStoresService {
  list: () => Promise<Store[]>,
  create: (store: Omit<Store, 'id'>) => Promise<Store>,
  update: (store: Store) => Promise<Store>,
  byId: (id: number) => Promise<Store | null>,
  del: (id: number) => Promise<void>,
}

@injectable()
class StoresService implements IStoresService {
  private prisma: PrismaClient;

  constructor(@inject(Service.Prisma) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  list = () => this.prisma.store.findMany();

  create = (store: Omit<Store, 'id'>) => {
    return this.prisma.store.create({data: store});
  };

  update = (store: Store) => {
    return this.prisma.store.update({
      where: {
        id: store.id,
      },
      data: store,
    });
  };

  byId = (id: number) => this.prisma.store.findUnique({where: {id}});

  del = async (id: number) => {
    await this.prisma.store.delete({where: {id}});
  };
}

export default StoresService;
