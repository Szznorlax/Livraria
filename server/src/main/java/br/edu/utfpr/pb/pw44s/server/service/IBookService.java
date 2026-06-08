package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Book;

import java.util.List;

public interface IBookService extends ICrudService<Book, Long> {

    List<Book> findByCategoryId(Long categoryId);
}