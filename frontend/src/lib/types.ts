// Matches AccountDto.java
export interface Account {
  id: number;
  accountNumber: string;
  accountHolderName: string;
  balance: number;
  createdAt: string;
}

// Matches TransactionRequest.java
export interface TransactionRequest {
  amount: number;
}

// For creating a new account (POST body)
export interface CreateAccountRequest {
  accountNumber: string;
  accountHolderName: string;
  balance: number;
}

// Matches ErrorDetails.java
export interface ErrorDetails {
  timestamp: string;
  message: string;
  details: string;
  statusCode: number;
}
