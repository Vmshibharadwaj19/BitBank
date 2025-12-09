package com.emp.ems.dto;

public class ProfileUpdateRequestDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String requestedFullName;
    private String requestedEmail;
    private String requestedPhoneNumber;
    private String requestedAddress;
    private String status;
    private String requestedAt;
    private String reviewedAt;
    private String reviewedBy;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getRequestedFullName() { return requestedFullName; }
    public void setRequestedFullName(String requestedFullName) { this.requestedFullName = requestedFullName; }

    public String getRequestedEmail() { return requestedEmail; }
    public void setRequestedEmail(String requestedEmail) { this.requestedEmail = requestedEmail; }

    public String getRequestedPhoneNumber() { return requestedPhoneNumber; }
    public void setRequestedPhoneNumber(String requestedPhoneNumber) { this.requestedPhoneNumber = requestedPhoneNumber; }

    public String getRequestedAddress() { return requestedAddress; }
    public void setRequestedAddress(String requestedAddress) { this.requestedAddress = requestedAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRequestedAt() { return requestedAt; }
    public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }

    public String getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(String reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}

