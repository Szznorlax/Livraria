package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IBookService {
    List<Book> findAll();
    Page<Book> findAll(Pageable pageable);
    Book findById(Long id);
    Book save(Book book);
    void delete(Long id);
    boolean exists(Long id);
    long count();
}