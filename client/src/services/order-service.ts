import { api } from '@/lib/axios';
import type { IResponse } from '@/commons/types';

export interface IOrderItemRequest {
  bookId?: number;
  quantity: number;
}

export interface IOrderRequest {
  addressId: number;
  items: IOrderItemRequest[];
}

const createOrder = async (order: IOrderRequest): Promise<IResponse> => {
  let response = {} as IResponse;

  try {
    const payload = {
      addressId: order.addressId,
      items: order.items,
    };

    const data = await api.post('/orders', payload);

    response = {
      status: 200,
      success: true,
      message: 'Pedido criado com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao criar o pedido',
      data: err.response?.data || err.message,
    };
  }

  return response;
};

const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;

  try {
    const data = await api.get('/orders');
    response = {
      status: 200,
      success: true,
      message: 'Pedidos carregados com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar os pedidos',
      data: err.response?.data || err.message,
    };
  }

  return response;
};

const OrderService = {
  createOrder,
  findAll,
};

export default OrderService;
