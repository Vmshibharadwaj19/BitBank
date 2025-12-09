package com.emp.ems.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "accounts")
public class Account extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String accountNumber;

    private String sortCode;

    @Enumerated(EnumType.STRING)
    private AccountType type;   // SAVINGS / CURRENT / FIXED_DEPOSIT

    private double balance;

    private double interestRate; // e.g. 0.04 = 4% per year

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "fromAccount")
    @JsonIgnore
    private List<Transaction> outgoingTransactions;

    @OneToMany(mappedBy = "toAccount")
    @JsonIgnore
    private List<Transaction> incomingTransactions;

    // Getters and Setters
    public Long getId() { return id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getSortCode() { return sortCode; }
    public void setSortCode(String sortCode) { this.sortCode = sortCode; }

    public AccountType getType() { return type; }
    public void setType(AccountType type) { this.type = type; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Account() { }

    public Account(String sortCode, AccountType type, double balance, Customer customer) {
        this.sortCode = sortCode;
        this.type = type;
        this.balance = balance;
        this.customer = customer;
    }
}
