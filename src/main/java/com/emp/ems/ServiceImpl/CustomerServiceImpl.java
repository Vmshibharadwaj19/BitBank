package com.emp.ems.ServiceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Repositories.CustomerRepository;
import com.emp.ems.Service.CustomerService;
import com.emp.ems.entities.*;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository cust;
    private final AccountRepository acc;

    public CustomerServiceImpl(CustomerRepository cust, AccountRepository acc) {
        this.cust = cust;
        this.acc = acc;
    }

    @Transactional
    @Override
    public Customer createCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        
        // Validate required fields
        if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }
        
        // Check if email already exists
        Optional<Customer> existingCustomer = cust.findByEmail(customer.getEmail().trim());
        if (existingCustomer.isPresent()) {
            throw new IllegalArgumentException("Customer with email " + customer.getEmail() + " already exists");
        }
        
        Customer saved = cust.save(customer);
        
        if (saved == null || saved.getId() == null) {
            throw new RuntimeException("Failed to save customer");
        }

        // Create default account for the customer
        Account accEntity = new Account();
        String accNo = "ICICI000" + saved.getId();
        accEntity.setAccountNumber(accNo);
        accEntity.setSortCode("ICIC-09-10");
        accEntity.setBalance(0.0);
        accEntity.setType(AccountType.SAVINGS);
        accEntity.setInterestRate(0.04);
        accEntity.setCustomer(saved);
        acc.save(accEntity);

        return saved;
    }

    @Override
    public Customer updateCustomer(Long id, Customer custom) {
        if (id == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        if (custom == null) {
            throw new IllegalArgumentException("Customer data cannot be null");
        }
        
        Customer customer = cust.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        
        // Update only non-null fields
        if (custom.getEmail() != null && !custom.getEmail().trim().isEmpty()) {
            // Check if email is being changed and if new email already exists
            if (!customer.getEmail().equals(custom.getEmail().trim())) {
                Optional<Customer> existingCustomer = cust.findByEmail(custom.getEmail().trim());
                if (existingCustomer.isPresent() && !existingCustomer.get().getId().equals(id)) {
                    throw new IllegalArgumentException("Email " + custom.getEmail() + " is already in use");
                }
            }
            customer.setEmail(custom.getEmail().trim());
        }
        
        if (custom.getAddress() != null) {
            customer.setAddress(custom.getAddress());
        }
        
        if (custom.getFullName() != null && !custom.getFullName().trim().isEmpty()) {
            customer.setFullName(custom.getFullName().trim());
        }
        
        if (custom.getPhoneNumber() != null) {
            customer.setPhoneNumber(custom.getPhoneNumber());
        }
        
        if (custom.getRole() != null) {
            customer.setRole(custom.getRole());
        }
        
        return cust.save(customer);
    }

    @Override
    public Customer getCustomer(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        return cust.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    @Override
    public List<Customer> getAllCustomers() {
        return cust.findAll();
    }

    @Override
    public void deleteCustomer(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        
        // Check if customer exists before deleting
        if (!cust.existsById(id)) {
            throw new RuntimeException("Customer not found with ID: " + id);
        }
        
        cust.deleteById(id);
    }

    @Override
    public Customer save(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        return cust.save(customer);
    }

    @Override
    public Customer findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        Optional<Customer> optionalCustomer = cust.findByEmail(email.trim());
        return optionalCustomer.orElse(null);
    }

}
