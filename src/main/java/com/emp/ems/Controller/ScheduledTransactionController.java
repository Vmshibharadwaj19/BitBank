package com.emp.ems.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Service.ScheduledTransactionService;
import com.emp.ems.dto.ScheduledTransactionRequest;
import com.emp.ems.entities.ScheduledTransaction;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/scheduled-transactions")
public class ScheduledTransactionController {

    private final ScheduledTransactionService service;

    public ScheduledTransactionController(ScheduledTransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ScheduledTransaction> create(@RequestBody ScheduledTransactionRequest req) {
        return ResponseEntity.ok(service.createScheduledTransaction(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancel(@PathVariable Long id) {
        service.cancelScheduledTransaction(id);
        return ResponseEntity.ok("Cancelled");
    }

    @GetMapping
    public ResponseEntity<List<ScheduledTransaction>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
