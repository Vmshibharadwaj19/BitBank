package com.emp.ems.ServiceImpl;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Repositories.TransactionRepository;
import com.emp.ems.entities.Account;
import com.emp.ems.entities.AccountType;
import com.emp.ems.entities.Transaction;
import com.emp.ems.entities.TransactionType;

@Service
public class InterestService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;

    public InterestService(AccountRepository accountRepo, TransactionRepository transactionRepo) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
    }

    // Run daily at 1 AM
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void applyDailyInterest() {
        List<Account> accounts = accountRepo.findByType(AccountType.SAVINGS);

        for (Account acc : accounts) {
            double annualRate = acc.getInterestRate();   
            double dailyRate = annualRate / 365.0;
            double interest = acc.getBalance() * dailyRate;

            if (interest <= 0) continue;

            acc.setBalance(acc.getBalance() + interest);
            accountRepo.save(acc);

            Transaction tx = new Transaction();
            tx.setType(TransactionType.INTEREST);
            tx.setAmount(interest);
            tx.setDescription("Daily interest");
            tx.setToAccount(acc);
            tx.setStatus("SUCCESS");
            transactionRepo.save(tx);
        }
    }
}
