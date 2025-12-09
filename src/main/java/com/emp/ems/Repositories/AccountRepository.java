package com.emp.ems.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emp.ems.entities.Account;
import com.emp.ems.entities.AccountType;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Account findByAccountNumber(String accountNumber);

    List<Account> findByType(AccountType type);
}
