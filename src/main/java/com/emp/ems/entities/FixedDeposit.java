package com.emp.ems.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fixed_deposits")
public class FixedDeposit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double principal;

    private double interestRate;

    private LocalDate startDate;

    private LocalDate maturityDate;

    private boolean closed;

    @ManyToOne
    @JoinColumn(name = "linked_account_id")
    private Account linkedAccount; // where to credit on maturity

    // Getters and Setters
    public Long getId() { return id; }

    public double getPrincipal() { return principal; }
    public void setPrincipal(double principal) { this.principal = principal; }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getMaturityDate() { return maturityDate; }
    public void setMaturityDate(LocalDate maturityDate) { this.maturityDate = maturityDate; }

    public boolean isClosed() { return closed; }
    public void setClosed(boolean closed) { this.closed = closed; }

    public Account getLinkedAccount() { return linkedAccount; }
    public void setLinkedAccount(Account linkedAccount) { this.linkedAccount = linkedAccount; }
}
