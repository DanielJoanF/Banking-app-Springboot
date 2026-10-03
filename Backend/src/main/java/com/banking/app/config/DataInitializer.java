package com.banking.app.config;

import com.banking.app.entity.Account;
import com.banking.app.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(AccountRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Account(null, "ACC1001", "Budi Santoso", new BigDecimal("5000000.00")));
                repository.save(new Account(null, "ACC1002", "Siti Rahma", new BigDecimal("12500000.00")));
                System.out.println(">>> Sample banking data initialized successfully!");
            }
        };
    }
}
