package com.emp.ems.Service;

import java.util.List;

import com.emp.ems.entities.ScheduledTransaction;
import com.emp.ems.dto.ScheduledTransactionRequest;

public interface ScheduledTransactionService {

    ScheduledTransaction createScheduledTransaction(ScheduledTransactionRequest req);

    void cancelScheduledTransaction(Long id);

    List<ScheduledTransaction> getAll();
}
