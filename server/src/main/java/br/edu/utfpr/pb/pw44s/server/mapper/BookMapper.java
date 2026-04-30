package br.edu.utfpr.pb.pw44s.server.mapper;


import br.edu.utfpr.pb.pw44s.server.dto.BookDTO;
import br.edu.utfpr.pb.pw44s.server.model.Book;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = CategoryMapper.class)
public interface BookMapper {

    BookDTO toDto(Book entity);

    Book toEntity(BookDTO dto);
}