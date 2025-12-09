package com.emp.ems.ServiceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Repositories.TransactionRepository;
import com.emp.ems.Service.TransactionService;
import com.emp.ems.entities.Account;
import com.emp.ems.entities.Transaction;
import com.emp.ems.entities.TransactionType;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository acc;
    private final TransactionRepository tran;

    public TransactionServiceImpl(AccountRepository acc, TransactionRepository tran) {
        this.acc = acc;
        this.tran = tran;
    }

    @Override
    @Transactional
    public boolean transfer(String fromAcc, String toAcc, double amount) {

        Account from = acc.findByAccountNumber(fromAcc);
        Account to = acc.findByAccountNumber(toAcc);

        if (from == null || to == null || amount <= 0 || amount > from.getBalance()) {
            return false;
        }

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        acc.save(from);
        acc.save(to);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.TRANSFER);
        tx.setAmount(amount);
        tx.setDescription("Transfer from " + fromAcc + " to " + toAcc);
        tx.setFromAccount(from);
        tx.setToAccount(to);
        tx.setStatus("SUCCESS");
        tran.save(tx);

        return true;
    }

    @Override
    @Transactional
    public boolean deposit(String accountNumber, double amount) {

        Account account = acc.findByAccountNumber(accountNumber);
        if (account == null || amount <= 0) return false;

        account.setBalance(account.getBalance() + amount);
        acc.save(account);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.DEPOSIT);
        tx.setAmount(amount);
        tx.setDescription("Deposit into " + accountNumber);
        tx.setToAccount(account);
        tx.setStatus("SUCCESS");
        tran.save(tx);

        return true;
    }

    @Override
    @Transactional
    public boolean withdraw(String accountNumber, double amount) {

        Account account = acc.findByAccountNumber(accountNumber);
        if (account == null || amount <= 0 || amount > account.getBalance()) {
            return false;
        }

        account.setBalance(account.getBalance() - amount);
        acc.save(account);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.WITHDRAW);
        tx.setAmount(amount);
        tx.setDescription("Withdraw from " + accountNumber);
        tx.setFromAccount(account);
        tx.setStatus("SUCCESS");
        tran.save(tx);

        return true;
    }
}
