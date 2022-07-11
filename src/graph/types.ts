import {PrismaClient} from '@prisma/client';
import {Container} from 'inversify';

export interface Context {
  user: string,
  prisma: PrismaClient,
  container: Container,
}

