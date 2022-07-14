import {log} from '../log';
import container from '../services/container';
import {IGoodsService} from '../services/GoodsService';
import {IOrdersService} from '../services/OrdersService';
import {IPricesService} from '../services/PricesService';
import {IStoresService} from '../services/StoresService';
import {Service} from '../services/types';

// yarn ts-node src/init/init.ts

const app = async () => {
  log.info('start');

  const goodsService = container.get<IGoodsService>(Service.Goods);
  const storesService = container.get<IStoresService>(Service.Stores);
  const pricesService = container.get<IPricesService>(Service.Prices);
  const ordersService = container.get<IOrdersService>(Service.Orders);

  const orange = await goodsService.create({title: 'Апельсин'});
  const sausage = await goodsService.create({title: 'Колбаса'});
  const radish = await goodsService.create({title: 'Редиска'});

  const main = await storesService.create({title: 'Основной'});
  const secondary = await storesService.create({title: 'Дополнительный'});

  await pricesService.create({goodId: orange.id, storeId: main.id, amount: 20});
  await pricesService.create({goodId: sausage.id, storeId: secondary.id, amount: 50});
  await pricesService.create({goodId: radish.id, storeId: main.id, amount: 10});

  await ordersService.create({goodId: orange.id, storeId: main.id, quantity: 5});
  await ordersService.create({goodId: sausage.id, storeId: secondary.id, quantity: 3});
  await ordersService.create({goodId: radish.id, storeId: main.id, quantity: 7});

  log.info('finish');
};

app();
