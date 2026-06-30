import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IBook, ICategory, IResponse } from '@/commons/types';
import BookService from '@/services/book-service';
import CategoryService from '@/services/category-service';
import './styles.css';

export const HomePage = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const response: IResponse = await BookService.findAll();
      if (response.success) {
        setBooks(response.data as IBook[]);
      } else {
        setError(response.message || 'Erro ao carregar livros');
      }

      const categoryResponse: IResponse = await CategoryService.findAll();
      if (categoryResponse.success) {
        setCategories(categoryResponse.data as ICategory[]);
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || book.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

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

      <div className="filters-panel">
        <div className="search-box">
          <i className="pi pi-search"></i>
          <input
            type="text"
            placeholder="Buscar por nome, autor ou descrição"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label htmlFor="category-select">Categoria</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-results">
          <i className="pi pi-info-circle"></i>
          <p>Nenhum livro encontrado para estes filtros.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
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
      )}
    </div>
  );
};