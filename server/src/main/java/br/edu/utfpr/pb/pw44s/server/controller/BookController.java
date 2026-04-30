package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.BookDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.BookMapper;
import br.edu.utfpr.pb.pw44s.server.model.Book;
import br.edu.utfpr.pb.pw44s.server.service.IBookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("books")
public class BookController {
    private final IBookService bookService;
    private final BookMapper bookMapper;

    public BookController(IBookService bookService, BookMapper  bookMapper) {
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    @PostMapping
    public ResponseEntity<BookDTO> save(@RequestBody @Valid BookDTO book) {
        Book bookSaved = bookService.save(bookMapper.toEntity(book));
        return ResponseEntity.status(HttpStatus.CREATED).body(bookMapper.toDto(bookSaved));
    }

    @PutMapping
    public ResponseEntity<BookDTO> update(@RequestBody @Valid BookDTO book) {
        Book bookSaved = bookService.save(bookMapper.toEntity(book));
        return ResponseEntity.status(HttpStatus.OK).body(bookMapper.toDto(bookSaved));
    }

    @GetMapping
    public ResponseEntity<List<BookDTO>> findAll() {
        return ResponseEntity.ok(
                bookService.findAll()
                        .stream()
                        .map(bookMapper::toDto)
                        .collect(Collectors.toList())
        );
    }

    // http://localhost:8080/books/1
    @GetMapping("{id}")
    public ResponseEntity<BookDTO> findById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        if (book != null) {
            return ResponseEntity.status(HttpStatus.OK).body(bookMapper.toDto(book));
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookService.delete(id);
    }

    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.status(HttpStatus.OK).body(bookService.count());
    }

    @GetMapping("exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(bookService.exists(id));
    }

    //http://localhost:8080/books/page?page=1&size=5
    @GetMapping("page")
    public ResponseEntity<Page<BookDTO>> findPage(@RequestParam int page,
                                                     @RequestParam int size,
                                                     @RequestParam(required = false) String order,
                                                     @RequestParam(required = false) Boolean asc) {
        PageRequest pageRequest = PageRequest.of(page, size);
        if (order != null && asc != null) {
            pageRequest = PageRequest.of(page, size,
                    asc ? Sort.Direction.ASC : Sort.Direction.DESC, order);
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                bookService.findAll(pageRequest).map(bookMapper::toDto));
    }
}