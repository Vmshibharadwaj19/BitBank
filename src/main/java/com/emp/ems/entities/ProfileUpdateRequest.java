package com.emp.ems.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile_update_requests")
public class ProfileUpdateRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private String requestedFullName;
    private String requestedEmail;
    private String requestedPhoneNumber;
    private String requestedAddress;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime requestedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy; // Admin email or ID

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getRequestedFullName() { return requestedFullName; }
    public void setRequestedFullName(String requestedFullName) { this.requestedFullName = requestedFullName; }

    public String getRequestedEmail() { return requestedEmail; }
    public void setRequestedEmail(String requestedEmail) { this.requestedEmail = requestedEmail; }

    public String getRequestedPhoneNumber() { return requestedPhoneNumber; }
    public void setRequestedPhoneNumber(String requestedPhoneNumber) { this.requestedPhoneNumber = requestedPhoneNumber; }

    public String getRequestedAddress() { return requestedAddress; }
    public void setRequestedAddress(String requestedAddress) { this.requestedAddress = requestedAddress; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}

