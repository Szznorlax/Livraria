import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { IBook } from '@/commons/types';
import BookService from '@/services/book-service';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import './styles.css';

export const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<IBook | null>(null);
  const [similarTitles, setSimilarTitles] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setError('ID do livro não fornecido');
        setLoading(false);
        return;
      }

      const response = await BookService.findById(parseInt(id));
      if (response.success) {
        setBook(response.data as IBook);
      } else {
        setError(response.message || 'Erro ao carregar o livro');
      }
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const loadSimilarTitles = async () => {
      if (!book) {
        setSimilarTitles([]);
        return;
      }

      const response = await BookService.findAll();
      if (response.success && Array.isArray(response.data)) {
        const similar = (response.data as IBook[])
          .filter((item) => item.id !== book.id && item.category?.name === book.category?.name)
          .slice(0, 5);
        setSimilarTitles(similar);
      }
    };

    loadSimilarTitles();
  }, [book]);

  const handleAddToCart = () => {
    if (book) {
      const cartItem = {
        ...book,
        cartQuantity: quantity,
      };

      // Recuperar carrinho atual do localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Verificar se o livro já está no carrinho
      const existingItem = existingCart.find((item: any) => item.id === book.id);

      if (existingItem) {
        // Se já existe, incrementar a quantidade
        existingItem.cartQuantity += quantity;
      } else {
        // Se não existe, adicionar
        existingCart.push(cartItem);
      }

      // Salvar no localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} de "${book.name}" adicionada(s) ao carrinho!`,
        life: 3000,
      });

      // Resetar quantidade
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Aqui você pode redirecionar para o carrinho ou checkout
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="book-details-container loading">
        <div>Carregando detalhes do livro...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-container error">
        <div>Erro: {error}</div>
        <Button
          label="Voltar"
          icon="pi pi-arrow-left"
          onClick={() => navigate('/')}
          className="p-button-outlined mt-3"
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-container not-found">
        <div>Livro não encontrado</div>
        <Button
          label="Voltar"
          icon="pi pi-arrow-left"
          onClick={() => navigate('/')}
          className="p-button-outlined mt-3"
        />
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <Toast ref={toast} />

      <Button
        icon="pi pi-arrow-left"
        label="Voltar"
        className="p-button-text mb-4"
        onClick={() => navigate('/')}
      />

      <div className="book-details-content">
        <div className="book-details-image">
          {book.imageURL ? (
            <img src={book.imageURL} alt={book.name} />
          ) : (
            <div className="no-image">
              <i className="pi pi-image"></i>
              <p>Sem imagem</p>
            </div>
          )}
        </div>

        <div className="book-details-info">
          <h1 className="book-title">{book.name}</h1>

          <div className="book-author">
            <p>
              <strong>Autor:</strong> {book.author}
            </p>
          </div>

          <div className="book-category">
            <p>
              <strong>Categoria:</strong> {book.category?.name || 'Não especificada'}
            </p>
          </div>

          <div className="book-price">
            <span className="price-value">
              R$ {parseFloat(book.price.toString()).toFixed(2)}
            </span>
          </div>

          <div className="book-description">
            <h3>Descrição</h3>
            <p>{book.description}</p>
          </div>

          <div className="book-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantidade:</label>
              <div className="quantity-input">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="qty-btn"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                label="Adicionar ao Carrinho"
                icon="pi pi-shopping-cart"
                onClick={handleAddToCart}
                className="p-button-success p-button-lg"
              />
              <Button
                label="Comprar Agora"
                icon="pi pi-check"
                onClick={handleBuyNow}
                className="p-button-secondary p-button-lg"
              />
            </div>
          </div>

          {book.id && (
            <div className="book-id">
              <small>ID do Produto: {book.id}</small>
            </div>
          )}

          {similarTitles.length > 0 && (
            <div className="similar-titles-section">
              <h2>Títulos similares</h2>
              <div className="similar-titles-list">
                {similarTitles.map((similar) => (
                  <button
                    key={similar.id}
                    type="button"
                    className="similar-title-item"
                    onClick={() => similar.id && navigate(`/books/details/${similar.id}`)}
                  >
                    <div>
                      <strong>{similar.name}</strong>
                      <span>{similar.author}</span>
                    </div>
                    <span>Ver</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
