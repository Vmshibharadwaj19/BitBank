package com.emp.ems.Service;

import java.util.List;
import com.emp.ems.entities.ProfileUpdateRequest;

public interface ProfileUpdateService {
    ProfileUpdateRequest requestProfileUpdate(Long customerId, ProfileUpdateRequest request);
    List<ProfileUpdateRequest> getPendingRequests();
    List<ProfileUpdateRequest> getCustomerRequests(Long customerId);
    ProfileUpdateRequest approveRequest(Long requestId, String adminEmail);
    ProfileUpdateRequest rejectRequest(Long requestId, String adminEmail);
}

