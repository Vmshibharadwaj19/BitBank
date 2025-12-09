package com.emp.ems.dto;

public class ProfileUpdateRequestPayload {
    private String requestedFullName;
    private String requestedEmail;
    private String requestedPhoneNumber;
    private String requestedAddress;

    // Getters and Setters
    public String getRequestedFullName() { return requestedFullName; }
    public void setRequestedFullName(String requestedFullName) { this.requestedFullName = requestedFullName; }

    public String getRequestedEmail() { return requestedEmail; }
    public void setRequestedEmail(String requestedEmail) { this.requestedEmail = requestedEmail; }

    public String getRequestedPhoneNumber() { return requestedPhoneNumber; }
    public void setRequestedPhoneNumber(String requestedPhoneNumber) { this.requestedPhoneNumber = requestedPhoneNumber; }

    public String getRequestedAddress() { return requestedAddress; }
    public void setRequestedAddress(String requestedAddress) { this.requestedAddress = requestedAddress; }
}

