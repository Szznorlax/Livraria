package br.edu.utfpr.pb.pw44s.server.service.impl;


import br.edu.utfpr.pb.pw44s.server.model.Book;
import br.edu.utfpr.pb.pw44s.server.repository.BookRepository;
import br.edu.utfpr.pb.pw44s.server.service.IBookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookServiceImpl implements IBookService {
    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Book> findAll() {
        return this.bookRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Book> findAll(Pageable pageable) {
        return this.bookRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Book findById(Long id) {
        return this.bookRepository.findById(id).orElse(null);
    }

    @Override
    public Book save(Book book) {
        return this.bookRepository.save(book);
    }

    @Override
    public void delete(Long id) {
        this.bookRepository.deleteById(id);
    }

    @Override
    public boolean exists(Long id) {
        return this.bookRepository.existsById(id);
    }

    @Override
    public long count() {
        return this.bookRepository.count();
    }
}