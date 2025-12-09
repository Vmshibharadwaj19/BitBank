package com.emp.ems.Repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.emp.ems.entities.Account;
import com.emp.ems.entities.Customer;
import com.emp.ems.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromAccountOrToAccount(Account from, Account to);
    
    // Fixed query to handle null accounts for deposit/withdraw
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.fromAccount IS NOT NULL AND t.fromAccount.customer = :customer) OR " +
           "(t.toAccount IS NOT NULL AND t.toAccount.customer = :customer) " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findByCustomer(@Param("customer") Customer customer);
    
    // Paginated version
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.fromAccount IS NOT NULL AND t.fromAccount.customer = :customer) OR " +
           "(t.toAccount IS NOT NULL AND t.toAccount.customer = :customer) " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByCustomer(@Param("customer") Customer customer, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.fromAccount = :account OR t.toAccount = :account) " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findByAccount(@Param("account") Account account);
    
    // Paginated version for account
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.fromAccount = :account OR t.toAccount = :account) " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccount(@Param("account") Account account, Pageable pageable);
}
