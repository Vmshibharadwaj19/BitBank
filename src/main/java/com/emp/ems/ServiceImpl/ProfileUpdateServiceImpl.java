package com.emp.ems.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import com.emp.ems.Repositories.CustomerRepository;
import com.emp.ems.Repositories.ProfileUpdateRequestRepository;
import com.emp.ems.Service.ProfileUpdateService;
import com.emp.ems.entities.Customer;
import com.emp.ems.entities.ProfileUpdateRequest;
import com.emp.ems.entities.ProfileUpdateRequest.RequestStatus;

@Service
public class ProfileUpdateServiceImpl implements ProfileUpdateService {

    private final ProfileUpdateRequestRepository requestRepo;
    private final CustomerRepository customerRepo;

    public ProfileUpdateServiceImpl(ProfileUpdateRequestRepository requestRepo,
                                   CustomerRepository customerRepo) {
        this.requestRepo = requestRepo;
        this.customerRepo = customerRepo;
    }

    @Override
    @Transactional
    public ProfileUpdateRequest requestProfileUpdate(Long customerId, ProfileUpdateRequest request) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check if there's already a pending request
        List<ProfileUpdateRequest> pendingRequests = requestRepo.findByCustomerAndStatus(
            customer, RequestStatus.PENDING
        );
        
        if (!pendingRequests.isEmpty()) {
            throw new RuntimeException("You already have a pending profile update request. Please wait for admin approval.");
        }

        // Validate that at least one field is being changed
        boolean hasChanges = 
            (request.getRequestedFullName() != null && !request.getRequestedFullName().equals(customer.getFullName())) ||
            (request.getRequestedEmail() != null && !request.getRequestedEmail().equals(customer.getEmail())) ||
            (request.getRequestedPhoneNumber() != null && !request.getRequestedPhoneNumber().equals(customer.getPhoneNumber())) ||
            (request.getRequestedAddress() != null && !request.getRequestedAddress().equals(customer.getAddress()));

        if (!hasChanges) {
            throw new RuntimeException("No changes detected. Please modify at least one field.");
        }

        request.setCustomer(customer);
        request.setStatus(RequestStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());
        
        return requestRepo.save(request);
    }

    @Override
    public List<ProfileUpdateRequest> getPendingRequests() {
        return requestRepo.findByStatus(RequestStatus.PENDING);
    }

    @Override
    public List<ProfileUpdateRequest> getCustomerRequests(Long customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return requestRepo.findByCustomer(customer);
    }

    @Override
    @Transactional
    public ProfileUpdateRequest approveRequest(Long requestId, String adminEmail) {
        ProfileUpdateRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        Customer customer = request.getCustomer();

        // Apply the changes
        if (request.getRequestedFullName() != null && !request.getRequestedFullName().trim().isEmpty()) {
            customer.setFullName(request.getRequestedFullName().trim());
        }
        if (request.getRequestedEmail() != null && !request.getRequestedEmail().trim().isEmpty()) {
            // Check email uniqueness if email is being changed
            String newEmail = request.getRequestedEmail().trim();
            if (!customer.getEmail().equals(newEmail)) {
                Optional<Customer> existingCustomer = customerRepo.findByEmail(newEmail);
                if (existingCustomer.isPresent() && !existingCustomer.get().getId().equals(customer.getId())) {
                    throw new RuntimeException("Email " + newEmail + " is already in use by another customer");
                }
            }
            customer.setEmail(newEmail);
        }
        if (request.getRequestedPhoneNumber() != null) {
            customer.setPhoneNumber(request.getRequestedPhoneNumber());
        }
        if (request.getRequestedAddress() != null) {
            customer.setAddress(request.getRequestedAddress());
        }

        customerRepo.save(customer);

        // Update request status
        request.setStatus(RequestStatus.APPROVED);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(adminEmail);

        return requestRepo.save(request);
    }

    @Override
    @Transactional
    public ProfileUpdateRequest rejectRequest(Long requestId, String adminEmail) {
        ProfileUpdateRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(adminEmail);

        return requestRepo.save(request);
    }
}

