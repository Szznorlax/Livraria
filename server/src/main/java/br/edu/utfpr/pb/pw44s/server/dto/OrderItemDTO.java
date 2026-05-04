package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;
    private Long bookId;
    private String bookName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}