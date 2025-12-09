package com.emp.ems.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emp.ems.Service.AccountService;
import com.emp.ems.entities.Account;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService acc;

    public AccountController(AccountService acc) {
        this.acc = acc;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(acc.getAccount(id));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(acc.getAllAccounts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account account) {
        return ResponseEntity.ok(acc.UpdateAccount(id, account));
    }
}
