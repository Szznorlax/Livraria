package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {

    @NotNull(message = "O ID do endereço de entrega é obrigatório")
    private Long addressId;

    @NotEmpty(message = "O pedido deve conter pelo menos um item")
    private List<OrderItemRequest> items;

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        @NotNull(message = "O ID do livro é obrigatório")
        private Long bookId;

        @NotNull(message = "A quantidade é obrigatória")
        private Integer quantity;
    }
}
