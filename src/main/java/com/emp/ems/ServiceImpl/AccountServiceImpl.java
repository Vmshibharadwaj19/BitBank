package com.emp.ems.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Service.AccountService;
import com.emp.ems.entities.Account;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository acc;

    public AccountServiceImpl(AccountRepository acc) {
        this.acc = acc;
    }

    @Override
    public Account UpdateAccount(Long id, Account account) {
        Account existing = acc.findById(id).orElseThrow();
        existing.setType(account.getType());
        existing.setInterestRate(account.getInterestRate());
        return acc.save(existing);
    }

    @Override
    public List<Account> getAllAccounts() {
        return acc.findAll();
    }

    @Override
    public Account getAccount(Long id) {
        return acc.findById(id)
                .orElseThrow(() -> new RuntimeException("Account Not found " + id));
    }
}
