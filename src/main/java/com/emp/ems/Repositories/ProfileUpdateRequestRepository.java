package com.emp.ems.Repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.emp.ems.entities.Customer;
import com.emp.ems.entities.ProfileUpdateRequest;
import com.emp.ems.entities.ProfileUpdateRequest.RequestStatus;

public interface ProfileUpdateRequestRepository extends JpaRepository<ProfileUpdateRequest, Long> {
    
    List<ProfileUpdateRequest> findByCustomer(Customer customer);
    
    List<ProfileUpdateRequest> findByStatus(RequestStatus status);
    
    @Query("SELECT p FROM ProfileUpdateRequest p WHERE p.customer = :customer AND p.status = :status ORDER BY p.requestedAt DESC")
    List<ProfileUpdateRequest> findByCustomerAndStatus(@Param("customer") Customer customer, @Param("status") RequestStatus status);
}

