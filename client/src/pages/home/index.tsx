import { useEffect, useState } from 'react';
import type { IBook, IResponse } from '@/commons/types';
import BookService from '@/services/book-service';

export const HomePage = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <h1>Livros Disponíveis</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            {book.imageURL && (
              <img
                src={book.imageURL}
                alt={book.name}
                style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '10px' }}
              />
            )}
            <h3>{book.name}</h3>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Preço:</strong> R$ {parseFloat(book.price.toString()).toFixed(2)}</p>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};