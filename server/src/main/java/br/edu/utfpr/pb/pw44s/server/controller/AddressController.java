package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {

    private final IAddressService addressService;
    private final AuthService authService;

    public AddressController(IAddressService addressService, AuthService authService) {
        this.addressService = addressService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        User user = authService.getAuthenticatedUser();
        AddressDTO createdAddress = addressService.createAddress(addressDTO, user);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses() {
        User user = authService.getAuthenticatedUser();
        List<AddressDTO> addresses = addressService.getUserAddresses(user);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        AddressDTO address = addressService.getAddressById(id, user);
        return ResponseEntity.ok(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id,
                                                    @Valid @RequestBody AddressDTO addressDTO) {
        User user = authService.getAuthenticatedUser();
        AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO, user);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        addressService.deleteAddress(id, user);
        return ResponseEntity.noContent().build();
    }
}
