package com.emp.ems.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emp.ems.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);
}
