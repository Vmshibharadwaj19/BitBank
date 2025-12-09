package com.emp.ems.Service;

import java.util.List;

import com.emp.ems.entities.Customer;

public interface CustomerService {

    Customer createCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer custom);

    Customer getCustomer(Long id);

    List<Customer> getAllCustomers();

    void deleteCustomer(Long id);

    Customer save(Customer customer);

    Customer findByEmail(String email);
}
