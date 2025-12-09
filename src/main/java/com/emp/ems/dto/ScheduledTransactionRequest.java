package com.emp.ems.dto;

import com.emp.ems.entities.Frequency;

public class ScheduledTransactionRequest {
    public String fromAccountNumber;
    public String toAccountNumber;
    public double amount;
    public Frequency frequency;
}
