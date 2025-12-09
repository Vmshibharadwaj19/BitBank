package com.emp.ems.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Repositories.AccountRepository;
import com.emp.ems.Repositories.CustomerRepository;
import com.emp.ems.Repositories.TransactionRepository;
import com.emp.ems.Service.TransactionService;
import com.emp.ems.dto.DepositRequest;
import com.emp.ems.dto.TransactionPageResponse;
import com.emp.ems.dto.WithdrawRequest;
import com.emp.ems.dto.TransferRequest;
import com.emp.ems.entities.Customer;
import com.emp.ems.entities.Transaction;

@CrossOrigin("*")
@RestController
public class TransactionController {

    private final TransactionService tran;
    private final TransactionRepository transactionRepo;
    private final CustomerRepository customerRepo;
    private final AccountRepository accountRepo;

    public TransactionController(TransactionService tran, 
                                TransactionRepository transactionRepo,
                                CustomerRepository customerRepo,
                                AccountRepository accountRepo) {
        this.tran = tran;
        this.transactionRepo = transactionRepo;
        this.customerRepo = customerRepo;
        this.accountRepo = accountRepo;
    }

    // Existing POST endpoints - keeping backward compatibility
    @PostMapping("/api/transaction/deposit")
    public ResponseEntity<Boolean> deposit(@RequestBody DepositRequest req) {
        // Trim account number to handle whitespace issues
        String accountNumber = req.accountNumber != null ? req.accountNumber.trim() : null;
        if (accountNumber == null || accountRepo.findByAccountNumber(accountNumber) == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tran.deposit(accountNumber, req.amount));
    }

    @PostMapping("/api/transaction/withdraw")
    public ResponseEntity<Boolean> withdraw(@RequestBody WithdrawRequest req) {
        // Trim account number to handle whitespace issues
        String accountNumber = req.accountNumber != null ? req.accountNumber.trim() : null;
        if (accountNumber == null || accountRepo.findByAccountNumber(accountNumber) == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tran.withdraw(accountNumber, req.amount));
    }

    @PostMapping("/api/transaction/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest req) {
        try {
            // Trim account numbers to handle whitespace issues
            String fromAccount = req.fromAccount != null ? req.fromAccount.trim() : null;
            String toAccount = req.toAccount != null ? req.toAccount.trim() : null;
            
            // Validate recipient account exists
            if (toAccount == null || accountRepo.findByAccountNumber(toAccount) == null) {
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                    put("error", "Invalid recipient account number. Account \"" + (req.toAccount != null ? req.toAccount : "null") + "\" does not exist.");
                    put("message", "Invalid recipient account number. Account \"" + (req.toAccount != null ? req.toAccount : "null") + "\" does not exist.");
                }});
            }
            
            // Validate sender account exists
            if (fromAccount == null || accountRepo.findByAccountNumber(fromAccount) == null) {
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                    put("error", "Invalid sender account number. Account \"" + (req.fromAccount != null ? req.fromAccount : "null") + "\" does not exist.");
                    put("message", "Invalid sender account number. Account \"" + (req.fromAccount != null ? req.fromAccount : "null") + "\" does not exist.");
                }});
            }
            
            boolean result = tran.transfer(fromAccount, toAccount, req.amount);
            
            if (!result) {
                // Check specific failure reasons
                var fromAccountEntity = accountRepo.findByAccountNumber(fromAccount);
                var toAccountEntity = accountRepo.findByAccountNumber(toAccount);
                
                if (fromAccountEntity == null || toAccountEntity == null) {
                    return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                        put("error", "One or both account numbers are invalid.");
                        put("message", "One or both account numbers are invalid.");
                    }});
                }
                
                if (req.amount <= 0) {
                    return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                        put("error", "Transfer amount must be greater than 0.");
                        put("message", "Transfer amount must be greater than 0.");
                    }});
                }
                
                if (req.amount > fromAccountEntity.getBalance()) {
                    return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                        put("error", "Insufficient balance. Your account balance is ₹" + String.format("%.2f", fromAccountEntity.getBalance()) + ".");
                        put("message", "Insufficient balance. Your account balance is ₹" + String.format("%.2f", fromAccountEntity.getBalance()) + ".");
                    }});
                }
                
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                    put("error", "Transfer failed. Please verify account numbers and balance.");
                    put("message", "Transfer failed. Please verify account numbers and balance.");
                }});
            }
            
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
                put("success", true);
                put("message", "Transfer completed successfully");
            }});
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("error", "Transfer failed: " + e.getMessage());
                put("message", "Transfer failed: " + e.getMessage());
            }});
        }
    }

    // Get all transactions for a customer (with pagination)
    @GetMapping("/api/transactions/customer/{customerId}")
    public ResponseEntity<?> getTransactionsByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepo.findByCustomer(customer, pageable);
        
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

    // Get all transactions (for admin) with pagination
    @GetMapping("/api/transactions")
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepo.findAll(pageable);
        
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
