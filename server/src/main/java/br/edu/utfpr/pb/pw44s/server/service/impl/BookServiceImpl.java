package br.edu.utfpr.pb.pw44s.server.service.impl;


import br.edu.utfpr.pb.pw44s.server.model.Book;
import br.edu.utfpr.pb.pw44s.server.repository.BookRepository;
import br.edu.utfpr.pb.pw44s.server.service.IBookService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl extends CrudServiceImpl<Book, Long>
        implements IBookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    protected JpaRepository<Book, Long> getRepository() {
        return bookRepository;
    }

}