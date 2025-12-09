package com.emp.ems.Service;

public interface OtpService {
    String generateOtp(String email);
    boolean validateOtp(String email, String otp);
}
