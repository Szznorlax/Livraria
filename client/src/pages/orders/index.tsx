import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import OrderService from '@/services/order-service';
import './styles.css';

interface IOrderItemView {
  bookId?: number;
  quantity: number;
}

interface IOrderView {
  id?: number;
  addressId?: number;
  createdAt?: string;
  status?: string;
  items?: IOrderItemView[];
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrderView[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      const response = await OrderService.findAll();
      if (response.success) {
        setOrders(Array.isArray(response.data) ? response.data as IOrderView[] : []);
      }
      setLoading(false);
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="orders-page loading">Carregando pedidos...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <Button icon="pi pi-arrow-left" label="Voltar" className="p-button-text" onClick={() => navigate('/')} />
        <h1>Meus Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <i className="pi pi-shopping-bag"></i>
          <h2>Nenhum pedido encontrado</h2>
          <p>Você ainda não realizou nenhuma compra.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>Pedido #{order.id}</h3>
                  <p>{order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : 'Data indisponível'}</p>
                </div>
                <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                  {order.status || 'PENDING'}
                </span>
              </div>

              <div className="order-items">
                {(order.items || []).map((item, index) => (
                  <div key={`${order.id}-${index}`} className="order-item">
                    <span>Livro #{item.bookId}</span>
                    <span>Qtd: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
