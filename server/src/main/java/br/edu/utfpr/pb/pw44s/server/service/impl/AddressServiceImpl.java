package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressServiceImpl implements IAddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    public AddressServiceImpl(AddressRepository addressRepository, AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
    }

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        validateUser(user);

        if (addressDTO == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        Address address = addressMapper.toEntity(addressDTO);
        address.setId(null);
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);
        return addressMapper.toDTO(savedAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDTO> getUserAddresses(User user) {
        validateUser(user);

        return addressRepository.findByUserId(user.getId()).stream()
                .map(addressMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AddressDTO getAddressById(Long id, User user) {
        Address address = findAddressById(id);
        validateOwnership(address, user);

        return addressMapper.toDTO(address);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(Long id, AddressDTO addressDTO, User user) {
        if (addressDTO == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        Address address = findAddressById(id);
        validateOwnership(address, user);

        address.setStreet(addressDTO.getStreet());
        address.setNumber(addressDTO.getNumber());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setZipCode(addressDTO.getZipCode());

        Address updatedAddress = addressRepository.save(address);
        return addressMapper.toDTO(updatedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(Long id, User user) {
        Address address = findAddressById(id);
        validateOwnership(address, user);

        addressRepository.delete(address);
    }

    private Address findAddressById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID do endereço é obrigatório");
        }

        return addressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Endereço não encontrado"));
    }

    private void validateUser(User user) {
        if (user == null) {
            throw new AccessDeniedException("Usuário não autenticado");
        }
    }

    private void validateOwnership(Address address, User user) {
        validateUser(user);

        if (address.getUser() == null || address.getUser().getId() != user.getId()) {
            throw new AccessDeniedException("Acesso não autorizado a este endereço");
        }
    }
}