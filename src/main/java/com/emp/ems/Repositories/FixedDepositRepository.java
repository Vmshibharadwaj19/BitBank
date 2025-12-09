package com.emp.ems.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emp.ems.entities.FixedDeposit;

public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {

    List<FixedDeposit> findByClosedFalseAndMaturityDateBefore(LocalDate date);
}
