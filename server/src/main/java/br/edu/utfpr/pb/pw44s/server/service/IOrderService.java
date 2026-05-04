package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CreateOrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IOrderService {
    OrderDTO createOrder(CreateOrderDTO createOrderDTO, User user);
    List<OrderDTO> getUserOrders(User user);
    OrderDTO getOrderById(Long id, User user);
}
