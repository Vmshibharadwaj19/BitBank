package com.emp.ems.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Repositories.CustomerRepository;
import com.emp.ems.Service.ProfileUpdateService;
import com.emp.ems.dto.ProfileUpdateRequestDTO;
import com.emp.ems.dto.ProfileUpdateRequestPayload;
import com.emp.ems.entities.Customer;
import com.emp.ems.entities.ProfileUpdateRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileUpdateService profileUpdateService;
    private final CustomerRepository customerRepo;

    public ProfileController(ProfileUpdateService profileUpdateService,
                            CustomerRepository customerRepo) {
        this.profileUpdateService = profileUpdateService;
        this.customerRepo = customerRepo;
    }

    // User requests profile update (only for customers, not admins)
    @PostMapping("/update-request")
    public ResponseEntity<?> requestProfileUpdate(
            @RequestParam Long customerId,
            @RequestBody ProfileUpdateRequestPayload payload) {
        try {
            Customer customer = customerRepo.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Prevent admins from submitting update requests
            if ("ADMIN".equalsIgnoreCase(customer.getRole())) {
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                    put("error", "Admins cannot submit profile update requests. Please use direct update.");
                    put("message", "Admins cannot submit profile update requests. Please use direct update.");
                }});
            }
            
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setRequestedFullName(payload.getRequestedFullName());
            request.setRequestedEmail(payload.getRequestedEmail());
            request.setRequestedPhoneNumber(payload.getRequestedPhoneNumber());
            request.setRequestedAddress(payload.getRequestedAddress());
            
            ProfileUpdateRequest saved = profileUpdateService.requestProfileUpdate(customerId, request);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("error", e.getMessage());
                put("message", e.getMessage());
            }});
        }
    }

    // Get user's profile update requests
    @GetMapping("/update-requests/{customerId}")
    public ResponseEntity<List<ProfileUpdateRequest>> getCustomerRequests(@PathVariable Long customerId) {
        List<ProfileUpdateRequest> requests = profileUpdateService.getCustomerRequests(customerId);
        return ResponseEntity.ok(requests);
    }

    // Admin: Get all pending requests
    @GetMapping("/admin/pending-requests")
    public ResponseEntity<List<ProfileUpdateRequestDTO>> getPendingRequests() {
        List<ProfileUpdateRequest> requests = profileUpdateService.getPendingRequests();
        
        List<ProfileUpdateRequestDTO> dtos = requests.stream().map(req -> {
            ProfileUpdateRequestDTO dto = new ProfileUpdateRequestDTO();
            dto.setId(req.getId());
            dto.setCustomerId(req.getCustomer().getId());
            dto.setCustomerName(req.getCustomer().getFullName());
            dto.setCustomerEmail(req.getCustomer().getEmail());
            dto.setRequestedFullName(req.getRequestedFullName());
            dto.setRequestedEmail(req.getRequestedEmail());
            dto.setRequestedPhoneNumber(req.getRequestedPhoneNumber());
            dto.setRequestedAddress(req.getRequestedAddress());
            dto.setStatus(req.getStatus().toString());
            dto.setRequestedAt(req.getRequestedAt() != null ? req.getRequestedAt().toString() : null);
            dto.setReviewedAt(req.getReviewedAt() != null ? req.getReviewedAt().toString() : null);
            dto.setReviewedBy(req.getReviewedBy());
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    // Admin: Approve request
    @PostMapping("/admin/approve/{requestId}")
    public ResponseEntity<ProfileUpdateRequest> approveRequest(
            @PathVariable Long requestId,
            @RequestParam String adminEmail) {
        ProfileUpdateRequest approved = profileUpdateService.approveRequest(requestId, adminEmail);
        return ResponseEntity.ok(approved);
    }

    // Admin: Reject request
    @PostMapping("/admin/reject/{requestId}")
    public ResponseEntity<ProfileUpdateRequest> rejectRequest(
            @PathVariable Long requestId,
            @RequestParam String adminEmail) {
        ProfileUpdateRequest rejected = profileUpdateService.rejectRequest(requestId, adminEmail);
        return ResponseEntity.ok(rejected);
    }
}

