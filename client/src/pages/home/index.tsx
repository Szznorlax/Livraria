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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, books]);

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
        <>
          <div className="books-grid">
            {paginatedBooks.map(book => (
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

          <div className="pagination-footer">
            <div className="pagination-summary">
              Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBooks.length)} - {Math.min(currentPage * itemsPerPage, filteredBooks.length)} de {filteredBooks.length} livros
            </div>
            <div className="pagination-list">
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};