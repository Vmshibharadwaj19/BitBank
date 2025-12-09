package com.emp.ems.dto;

public class OtpResponse {
    private String message;
    private String otp; // For demo purposes, OTP is included in response
    
    public OtpResponse(String message, String otp) {
        this.message = message;
        this.otp = otp;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getOtp() {
        return otp;
    }
    
    public void setOtp(String otp) {
        this.otp = otp;
    }
}


