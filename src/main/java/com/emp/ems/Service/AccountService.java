package com.emp.ems.Service;

import java.util.List;

import com.emp.ems.entities.Account;

public interface AccountService {

    Account UpdateAccount(Long id, Account acc);

    List<Account> getAllAccounts();

    Account getAccount(Long id);
}
