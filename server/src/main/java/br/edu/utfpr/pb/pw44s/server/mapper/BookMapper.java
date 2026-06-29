package br.edu.utfpr.pb.pw44s.server.mapper;


import br.edu.utfpr.pb.pw44s.server.dto.BookDTO;
import br.edu.utfpr.pb.pw44s.server.model.Book;
import org.mapstruct.Mapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = CategoryMapper.class)
public interface BookMapper {

    @Mapping(target = "author", source = "author")
    BookDTO toDto(Book entity);

    @Mapping(target = "author", source = "author")
    Book toEntity(BookDTO dto);
}
