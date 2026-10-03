package com.banking.app.service;

import com.banking.app.dto.AccountDto;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    AccountDto createAccount(AccountDto accountDto);
    AccountDto getAccountById(Long id);
    AccountDto getAccountByNumber(String accountNumber);
    List<AccountDto> getAllAccounts();
    AccountDto deposit(Long id, BigDecimal amount);
    AccountDto withdraw(Long id, BigDecimal amount);
    void deleteAccount(Long id);
}
