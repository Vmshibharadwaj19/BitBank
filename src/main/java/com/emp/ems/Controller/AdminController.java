package com.emp.ems.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Service.CustomerService;
import com.emp.ems.entities.Customer;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CustomerService customerService;

    public AdminController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PostMapping("/customers/{id}/lock")
    public ResponseEntity<String> lockCustomer(@PathVariable Long id) {
        Customer c = customerService.getCustomer(id);
        c.setLocked(true);
        customerService.save(c);
        return ResponseEntity.ok("Customer locked");
    }

    @PostMapping("/customers/{id}/unlock")
    public ResponseEntity<String> unlockCustomer(@PathVariable Long id) {
        Customer c = customerService.getCustomer(id);
        c.setLocked(false);
        c.setFailedLoginAttempts(0);
        c.setLockedUntil(null);
        customerService.save(c);
        return ResponseEntity.ok("Customer unlocked");
    }
}
