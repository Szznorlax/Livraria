package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.math.BigDecimal;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface OrderMapper {

    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "items", source = "items")
    OrderDTO toDTO(Order order);

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookName", source = "book.name")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(orderItem))")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    default BigDecimal calculateSubtotal(OrderItem orderItem) {
        if (orderItem.getUnitPrice() != null && orderItem.getQuantity() != null) {
            return orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
        }
        return BigDecimal.ZERO;
    }
}