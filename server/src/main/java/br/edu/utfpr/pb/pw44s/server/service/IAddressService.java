package br.edu.utfpr.pb.pw44s.server.service;


import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IAddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);
    List<AddressDTO> getUserAddresses(User user);
    AddressDTO getAddressById(Long id, User user);
    AddressDTO updateAddress(Long id, AddressDTO addressDTO, User user);
    void deleteAddress(Long id, User user);
}
