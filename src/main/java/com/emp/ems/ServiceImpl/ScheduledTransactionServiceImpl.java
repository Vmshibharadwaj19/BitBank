package com.emp.ems.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.emp.ems.Repositories.ScheduledTransactionRepository;
import com.emp.ems.Service.ScheduledTransactionService;
import com.emp.ems.Service.TransactionService;
import com.emp.ems.dto.ScheduledTransactionRequest;
import com.emp.ems.entities.Frequency;
import com.emp.ems.entities.ScheduledTransaction;

@Service
public class ScheduledTransactionServiceImpl implements ScheduledTransactionService {

    private final ScheduledTransactionRepository repo;
    private final TransactionService tran;

    public ScheduledTransactionServiceImpl(ScheduledTransactionRepository repo, TransactionService tran) {
        this.repo = repo;
        this.tran = tran;
    }

    @Override
    public ScheduledTransaction createScheduledTransaction(ScheduledTransactionRequest req) {
        ScheduledTransaction st = new ScheduledTransaction();
        st.setFromAccountNumber(req.fromAccountNumber);
        st.setToAccountNumber(req.toAccountNumber);
        st.setAmount(req.amount);
        st.setFrequency(req.frequency);
        st.setNextExecution(LocalDateTime.now().plusMinutes(1)); // first run soon
        st.setActive(true);
        return repo.save(st);
    }

    @Override
    public void cancelScheduledTransaction(Long id) {
        ScheduledTransaction st = repo.findById(id).orElseThrow();
        st.setActive(false);
        repo.save(st);
    }

    @Override
    public List<ScheduledTransaction> getAll() {
        return repo.findAll();
    }

    @Scheduled(fixedDelay = 60000) // every minute
    @Transactional
    public void processDuePayments() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledTransaction> due = repo.findByActiveTrueAndNextExecutionBefore(now);

        for (ScheduledTransaction s : due) {
            boolean success = tran.transfer(s.getFromAccountNumber(),
                                            s.getToAccountNumber(),
                                            s.getAmount());
            if (success) {
                LocalDateTime next = s.getNextExecution();
                Frequency f = s.getFrequency();
                switch (f) {
                    case DAILY -> next = next.plusDays(1);
                    case WEEKLY -> next = next.plusWeeks(1);
                    case MONTHLY -> next = next.plusMonths(1);
                }
                s.setNextExecution(next);
            } else {
                // optional: deactivate on repeated failures
            }
        }

        repo.saveAll(due);
    }
}
