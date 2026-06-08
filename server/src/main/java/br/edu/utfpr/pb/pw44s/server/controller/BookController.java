package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.BookDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.BookMapper;
import br.edu.utfpr.pb.pw44s.server.model.Book;
import br.edu.utfpr.pb.pw44s.server.service.IBookService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("books")
public class BookController extends CrudController<Book, BookDTO, Long> {

    private final BookMapper bookMapper;

    public BookController(IBookService bookService, BookMapper bookMapper) {
        this.bookMapper = bookMapper;
        BookController.bookService = bookService;
    }

    private static IBookService bookService;

    @Override
    protected ICrudService<Book, Long> getService() {
        return bookService;
    }

    @Override
    protected BookDTO toDto(Book entity) {
        return bookMapper.toDto(entity);
    }

    @Override
    protected Book toEntity(BookDTO dto) {
        return bookMapper.toEntity(dto);
    }

    @GetMapping("category/{categoryId}")
    public ResponseEntity<List<BookDTO>> findByCategory(@PathVariable Long categoryId) {
        List<BookDTO> books = bookService.findByCategoryId(categoryId)
                .stream()
                .map(bookMapper::toDto)
                .toList();

        return ResponseEntity.ok(books);
    }
}