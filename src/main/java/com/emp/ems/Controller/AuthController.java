package com.emp.ems.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Service.CustomerService;
import com.emp.ems.dto.LoginResponse;
import com.emp.ems.dto.OtpLoginRequest;
import com.emp.ems.dto.OtpResponse;
import com.emp.ems.entities.Customer;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

   
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestParam(required = false) String email, 
                                         @RequestBody(required = false) Map<String, String> body) {
        
        // Handle both query param and request body for email
        String emailValue = email != null ? email : (body != null ? body.get("email") : null);
        
        if (emailValue == null || emailValue.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Customer c = customerService.findByEmail(emailValue.trim());

        if (c == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No customer found with email: " + emailValue);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Generate 6-digit OTP
        String code = String.format("%06d", 100000 + new Random().nextInt(900000));
        c.setOtpCode(code);
        c.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        customerService.save(c);

        // Return OTP in response for demo (since no SMTP configured)
        OtpResponse response = new OtpResponse(
            "OTP generated successfully. Since SMTP is not configured, OTP is returned in response.", 
            code
        );
        return ResponseEntity.ok(response);
    }


    @PostMapping("/login-otp")
    public ResponseEntity<?> loginWithOtp(@RequestBody OtpLoginRequest req) {
        
        if (req == null || req.email == null || req.otp == null || 
            req.email.trim().isEmpty() || req.otp.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email and OTP are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Customer c = customerService.findByEmail(req.email.trim());

        if (c == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No customer found with email: " + req.email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Check if account is locked
        if (c.isLocked()) {
            if (c.getLockedUntil() != null && LocalDateTime.now().isAfter(c.getLockedUntil())) {
                // Auto-unlock if lock period has expired
                c.setLocked(false);
                c.setFailedLoginAttempts(0);
                c.setLockedUntil(null);
                customerService.save(c);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Account is locked. Please try again later.");
                return ResponseEntity.status(HttpStatus.LOCKED).body(error);
            }
        }

        // Validate OTP
        if (c.getOtpCode() == null ||
            c.getOtpExpiry() == null ||
            LocalDateTime.now().isAfter(c.getOtpExpiry()) ||
            !c.getOtpCode().equals(req.otp.trim())) {

            int attempts = c.getFailedLoginAttempts() + 1;
            c.setFailedLoginAttempts(attempts);
            if (attempts >= 3) {
                c.setLocked(true);
                c.setLockedUntil(LocalDateTime.now().plusMinutes(15));
            }
            customerService.save(c);
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid or expired OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Login successful - clear OTP and failed attempts
        c.setOtpCode(null);
        c.setOtpExpiry(null);
        c.setFailedLoginAttempts(0);
        customerService.save(c);

        // Return customer data with login response
        LoginResponse loginResponse = new LoginResponse("Login successful", c);
        return ResponseEntity.ok(loginResponse);
    }
}
