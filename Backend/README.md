# Banking Application - Spring Boot

Aplikasi backend perbankan sederhana berbasis Spring Boot dengan arsitektur berlapis (Controller, Service, Repository, Entity, DTO).

---

## Teknologi yang Digunakan
- **Java 21 / 24**
- **Spring Boot 4 / 3** (Spring Web, Spring Data JPA, Spring Validation)
- **H2 In-Memory Database** (langsung siap pakai tanpa perlu instalasi database terpisah)
- **Maven Wrapper (`mvnw`)** (dapat langsung dijalankan tanpa perlu instalasi Maven manual)

---

## Cara Menjalankan Aplikasi

Buka terminal pada root project, lalu jalankan:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

Aplikasi akan berjalan pada port **8080**:
- Base URL: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:bankingdb`
  - **User Name**: `sa`
  - **Password**: *(kosongkan)*

---

## Struktur Paket

```text
com.banking.app/
├── config/
│   └── DataInitializer.java          # Seeding data dummy saat aplikasi pertama kali start
├── controller/
│   └── AccountController.java        # REST API Endpoints (/api/accounts)
├── dto/
│   ├── AccountDto.java               # DTO untuk akun
│   └── TransactionRequest.java       # DTO untuk deposit & withdraw
├── entity/
│   └── Account.java                  # Entity JPA tabel 'accounts'
├── exception/
│   ├── ErrorDetails.java             # Standar response error
│   ├── GlobalExceptionHandler.java   # Centralized error handler (@ControllerAdvice)
│   ├── InsufficientBalanceException.java
│   └── ResourceNotFoundException.java
├── repository/
│   └── AccountRepository.java        # Spring Data JPA Repository
├── service/
│   ├── AccountService.java           # Business logic interface
│   └── impl/
│       └── AccountServiceImpl.java   # Implementasi service
└── BankingAppApplication.java        # Main class
```

---

## Daftar REST API Endpoints

### 1. Ambil Semua Akun
- **GET** `/api/accounts`
- Response: `200 OK`

### 2. Ambil Akun Berdasarkan ID
- **GET** `/api/accounts/{id}`
- Contoh: `GET /api/accounts/1`

### 3. Buat Akun Baru
- **POST** `/api/accounts`
- Body JSON:
  ```json
  {
    "accountNumber": "ACC1003",
    "accountHolderName": "Rian Pratama",
    "balance": 1500000.00
  }
  ```

### 4. Deposit Saldo
- **PUT** `/api/accounts/{id}/deposit`
- Body JSON:
  ```json
  {
    "amount": 500000.00
  }
  ```

### 5. Tarik Saldo (Withdraw)
- **PUT** `/api/accounts/{id}/withdraw`
- Body JSON:
  ```json
  {
    "amount": 250000.00
  }
  ```

### 6. Hapus Akun
- **DELETE** `/api/accounts/{id}`
