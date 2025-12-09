package com.emp.ems.Repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emp.ems.entities.ScheduledTransaction;

public interface ScheduledTransactionRepository extends JpaRepository<ScheduledTransaction, Long> {

    List<ScheduledTransaction> findByActiveTrueAndNextExecutionBefore(LocalDateTime time);
}
