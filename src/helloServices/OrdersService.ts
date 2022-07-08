import PricesService from './PricesService';

interface Order {
  id: number,
  goodId: number,
  storeId: number,
  quantity: number,
  total: number
}

class OrdersService {
  orders: Order[] = [
    {
      id: 1,
      goodId: 1,
      storeId: 1,
      quantity: 5,
      total: 50,

    },
    {
      id: 2,
      goodId: 1,
      storeId: 2,
      quantity: 10,
      total: 1000,
    },
  ];

  pricesService: PricesService;

  constructor(pricesService: PricesService) {
    this.pricesService = pricesService;
  }

  list = () => this.orders;

  create = (order: Omit<Order, 'id' | 'total'>) => {
    const maxId = Math.max(...this.orders.map(order => order.id));
    const id = maxId + 1;

    const price = this.pricesService.getPrice(order.goodId, order.storeId);

    this.orders.push({
      ...order,
      id,
      total: order.quantity * price,
    });

    return this.byId(id);
  };

  update = (order: Order) => {
    this.orders = this.orders.map(
      curent => (curent.id === order.id ? order : curent),
    );

    return this.byId(order.id);
  };

  byId = (id: number) => this.orders.find(order => order.id === id);

  del = (id: number) => {
    this.orders = this.orders.filter(order => order.id !== id);
  };
}

export default OrdersService;
