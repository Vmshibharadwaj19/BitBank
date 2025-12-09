package com.emp.ems.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Repositories.TransactionRepository;
import com.emp.ems.Service.StatementService;
import com.emp.ems.dto.TransactionPageResponse;
import com.emp.ems.entities.Account;
import com.emp.ems.entities.Transaction;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/statements")
public class StatementController {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final StatementService statementService;

    public StatementController(AccountRepository accountRepo,
                               TransactionRepository transactionRepo,
                               StatementService statementService) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
        this.statementService = statementService;
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<byte[]> downloadStatement(@PathVariable Long id) {
        Account acc = accountRepo.findById(id).orElseThrow();
        // Use findByAccount which properly handles deposit/withdraw
        List<Transaction> txs = transactionRepo.findByAccount(acc);

        byte[] pdfBytes = statementService.generateStatementPdf(acc, txs);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statement_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // Get transactions for an account with pagination
    @GetMapping("/account/{id}/transactions")
    public ResponseEntity<TransactionPageResponse> getAccountTransactions(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Account acc = accountRepo.findById(id).orElseThrow();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepo.findByAccount(acc, pageable);
        
        TransactionPageResponse response = new TransactionPageResponse(
            transactionPage.getContent(),
            transactionPage.getTotalPages(),
            transactionPage.getTotalElements(),
            transactionPage.getNumber(),
            transactionPage.getSize(),
            transactionPage.hasNext(),
            transactionPage.hasPrevious()
        );
        
        return ResponseEntity.ok(response);
    }
}
