package com.emp.ems.Service;

import java.util.List;

import com.emp.ems.entities.Account;
import com.emp.ems.entities.Transaction;

public interface StatementService {

    byte[] generateStatementPdf(Account account, List<Transaction> transactions);
}
