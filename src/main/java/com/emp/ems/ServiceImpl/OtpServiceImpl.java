package com.emp.ems.ServiceImpl;

import java.util.HashMap;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.emp.ems.Service.OtpService;

@Service
public class OtpServiceImpl implements OtpService {

    private HashMap<String, String> otpStore = new HashMap<>();

    @Override
    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);
        System.out.println("Generated OTP for " + email + ": " + otp);
        return otp;
    }

    @Override
    public boolean validateOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) return false;
        return otpStore.get(email).equals(otp);
    }
}
