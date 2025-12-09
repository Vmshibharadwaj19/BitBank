package com.emp.ems.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // DEPOSIT / WITHDRAW / TRANSFER / INTEREST

    private double amount;
    private String description;

    @ManyToOne
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;  // null for deposit

    @ManyToOne
    @JoinColumn(name = "to_account_id")
    private Account toAccount;    // null for withdraw

    private String status; // SUCCESS / FAILED

    // Getters / Setters
    public Long getId() { return id; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Account getFromAccount() { return fromAccount; }
    public void setFromAccount(Account fromAccount) { this.fromAccount = fromAccount; }

    public Account getToAccount() { return toAccount; }
    public void setToAccount(Account toAccount) { this.toAccount = toAccount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
