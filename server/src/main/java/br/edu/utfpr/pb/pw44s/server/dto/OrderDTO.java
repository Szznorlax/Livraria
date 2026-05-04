package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;
    private AddressDTO shippingAddress;
}
