import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IAddress, IBook } from '@/commons/types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import OrderService from '@/services/order-service';
import AddressService from '@/services/address-service';
import './styles.css';

interface ICartItem extends IBook {
  cartQuantity: number;
}

export const CartPage = () => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<IAddress>({
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    recipientName: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as ICartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    }

    const loadAddresses = async () => {
      const response = await AddressService.findAll();
      if (response.success) {
        const loadedAddresses = Array.isArray(response.data) ? response.data : [];
        setAddresses(loadedAddresses);
        if (loadedAddresses.length > 0) {
          setSelectedAddressId(loadedAddresses[0].id ?? null);
        }
      }
    };

    loadAddresses();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  }, [items]);

  const updateQuantity = (id?: number, delta: number) => {
    if (!id) return;

    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const nextQuantity = item.cartQuantity + delta;
            return nextQuantity > 0 ? { ...item, cartQuantity: nextQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as ICartItem[];

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id?: number) => {
    if (!id) return;

    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const handleCreateAddress = async () => {
    if (!newAddress.street || !newAddress.number || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.recipientName) {
      window.alert('Preencha todos os campos obrigatórios do endereço');
      return;
    }

    const response = await AddressService.create(newAddress);
    if (response.success) {
      const createdAddress = response.data as IAddress;
      const nextAddresses = [...addresses, createdAddress];
      setAddresses(nextAddresses);
      setSelectedAddressId(createdAddress.id ?? null);
      setNewAddress({
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        recipientName: '',
      });
      setShowAddressForm(false);
    }
  };

  const handleFinalizePurchase = async () => {
    if (items.length === 0) return;
    if (!selectedAddressId) {
      window.alert('Selecione ou cadastre um endereço de entrega');
      return;
    }

    try {
      const response = await OrderService.createOrder({
        addressId: selectedAddressId,
        items: items.map((item) => ({
          bookId: item.id,
          quantity: item.cartQuantity,
        })),
      });

      if (response.success) {
        clearCart();
        navigate('/');
        window.alert('Compra finalizada com sucesso!');
      } else {
        window.alert(response.message || 'Erro ao finalizar a compra');
      }
    } catch {
      window.alert('Erro ao finalizar a compra');
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Button
          icon="pi pi-arrow-left"
          label="Voltar"
          className="p-button-text"
          onClick={() => navigate('/')}
        />
        <h1>Carrinho de Compras</h1>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <i className="pi pi-shopping-cart"></i>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione alguns livros para continuar.</p>
          <Button label="Explorar livros" onClick={() => navigate('/')} />
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.name} />
                  ) : (
                    <div className="no-image">
                      <i className="pi pi-image"></i>
                    </div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-author">{item.author}</p>
                  <p className="cart-item-price">
                    Preço unitário: R$ {parseFloat(item.price.toString()).toFixed(2)}
                  </p>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.cartQuantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-danger"
                      onClick={() => removeItem(item.id)}
                      label="Remover"
                    />
                  </div>
                </div>

                <div className="cart-item-total">
                  <strong>R$ {parseFloat((item.price * item.cartQuantity).toString()).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Resumo</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="address-section">
              <h3>Endereço de entrega</h3>

              {addresses.length > 0 && (
                <div className="address-select">
                  <label htmlFor="address-select">Selecionar endereço</label>
                  <select
                    id="address-select"
                    value={selectedAddressId ?? ''}
                    onChange={(e) => setSelectedAddressId(Number(e.target.value) || null)}
                  >
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id ?? ''}>
                        {address.recipientName || 'Endereço'} — {address.street}, {address.number}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button
                label={showAddressForm ? 'Cancelar' : 'Adicionar endereço'}
                className="p-button-outlined w-full mt-2"
                onClick={() => setShowAddressForm((prev) => !prev)}
              />

              {showAddressForm && (
                <div className="address-form">
                  <InputText
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    placeholder="Nome do destinatário"
                  />
                  <InputText
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="Rua"
                  />
                  <InputText
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                    placeholder="Número"
                  />
                  <InputText
                    value={newAddress.complement}
                    onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                    placeholder="Complemento"
                  />
                  <InputText
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Cidade"
                  />
                  <InputText
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="Estado"
                  />
                  <InputText
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    placeholder="CEP"
                  />
                  <Button label="Salvar endereço" className="p-button-success w-full mt-2" onClick={handleCreateAddress} />
                </div>
              )}
            </div>

            <Button
              label="Finalizar compra"
              icon="pi pi-check"
              className="p-button-success w-full"
              onClick={handleFinalizePurchase}
            />
            <Button
              label="Limpar carrinho"
              className="p-button-outlined w-full mt-2"
              onClick={clearCart}
            />
          </aside>
        </div>
      )}
    </div>
  );
};
