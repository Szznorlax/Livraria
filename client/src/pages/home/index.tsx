import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IBook, IResponse } from '@/commons/types';
import BookService from '@/services/book-service';
import './styles.css';

export const HomePage = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const response: IResponse = await BookService.findAll();
      if (response.success) {
        setBooks(response.data as IBook[]);
      } else {
        setError(response.message || 'Erro ao carregar livros');
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId?: number) => {
    if (bookId) {
      navigate(`/books/details/${bookId}`);
    }
  };

  if (loading) return <div className="home-container loading">Carregando...</div>;
  if (error) return <div className="home-container error">Erro: {error}</div>;

  return (
    <div className="home-container">
      <h1 className="page-title">Livros Disponíveis</h1>
      <div className="books-grid">
        {books.map(book => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => handleBookClick(book.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBookClick(book.id);
              }
            }}
          >
            <div className="book-card-image">
              {book.imageURL ? (
                <img
                  src={book.imageURL}
                  alt={book.name}
                />
              ) : (
                <div className="no-image">
                  <i className="pi pi-image"></i>
                </div>
              )}
            </div>
            <div className="book-card-content">
              <h3 className="book-card-title">{book.name}</h3>
              <p className="book-card-author">{book.author}</p>
              <p className="book-card-price">
                R$ {parseFloat(book.price.toString()).toFixed(2)}
              </p>
              <p className="book-card-description">{book.description}</p>
              <div className="book-card-action">
                <span className="view-details">Ver Detalhes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};