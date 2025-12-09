package com.emp.ems.Service;

public interface TransactionService {

    boolean transfer(String fromAcc, String toAcc, double amount);

    boolean deposit(String accountNumber, double amount);

    boolean withdraw(String accountNumber, double amount);
}
