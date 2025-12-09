package com.emp.ems.dto;

import com.emp.ems.entities.Customer;

public class LoginResponse {
    private String message;
    private Customer customer;
    private String token; // For future JWT implementation
    
    public LoginResponse(String message, Customer customer) {
        this.message = message;
        this.customer = customer;
        this.token = "dummy-token"; // Stub token for now
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}


