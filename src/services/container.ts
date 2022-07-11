import {Container} from 'inversify';
import GoodsService, {IGoodsService} from './GoodsService';
import OrdersService, {IOrdersService} from './OrdersService';
import PricesService, {IPricesService} from './PricesService';
import StoresService, {IStoresService} from './StoresService';
import {Service} from './types';
import 'reflect-metadata';
import FilmsService, {IFilmsService} from './FilmsService';

const container = new Container({defaultScope: 'Singleton'});
container.bind<IGoodsService>(Service.Goods).to(GoodsService);
container.bind<IPricesService>(Service.Prices).to(PricesService);
container.bind<IStoresService>(Service.Stores).to(StoresService);
container.bind<IOrdersService>(Service.Orders).to(OrdersService);
container.bind<IFilmsService>(Service.Films).to(FilmsService);

export default container;
