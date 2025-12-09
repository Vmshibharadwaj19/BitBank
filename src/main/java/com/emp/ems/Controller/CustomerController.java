package com.emp.ems.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Service.CustomerService;
import com.emp.ems.entities.Customer;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService cust;

    @Autowired
    public CustomerController(CustomerService cust) {
        this.cust = cust;
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer custom) {
        Customer c = cust.createCustomer(custom);
        return ResponseEntity.ok(c);
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomer() {
        return ResponseEntity.ok(cust.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cust.getCustomer(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer c) {
        return ResponseEntity.ok(cust.updateCustomer(id, c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        cust.deleteCustomer(id);
        return ResponseEntity.ok("Deleted");
    }
}
