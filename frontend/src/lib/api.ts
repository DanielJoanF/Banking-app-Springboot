import type { Account, CreateAccountRequest, ErrorDetails } from "./types";

const BASE_URL = "/api/accounts";

/**
 * Helper: parse response dan throw error jika tidak OK
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Terjadi kesalahan pada server";
    try {
      const errorData: ErrorDetails = await response.json();
      errorMessage = errorData.message;
    } catch {
      // fallback ke status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Ambil semua akun
 * GET /api/accounts
 */
export async function getAllAccounts(): Promise<Account[]> {
  const response = await fetch(BASE_URL);
  return handleResponse<Account[]>(response);
}

/**
 * Ambil akun berdasarkan ID
 * GET /api/accounts/{id}
 */
export async function getAccountById(id: number): Promise<Account> {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Account>(response);
}

/**
 * Buat akun baru
 * POST /api/accounts
 */
export async function createAccount(
  data: CreateAccountRequest
): Promise<Account> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Account>(response);
}

/**
 * Deposit saldo
 * PUT /api/accounts/{id}/deposit
 */
export async function deposit(id: number, amount: number): Promise<Account> {
  const response = await fetch(`${BASE_URL}/${id}/deposit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return handleResponse<Account>(response);
}

/**
 * Tarik saldo
 * PUT /api/accounts/{id}/withdraw
 */
export async function withdraw(id: number, amount: number): Promise<Account> {
  const response = await fetch(`${BASE_URL}/${id}/withdraw`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return handleResponse<Account>(response);
}

/**
 * Hapus akun
 * DELETE /api/accounts/{id}
 */
export async function deleteAccount(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    let errorMessage = "Gagal menghapus akun";
    try {
      const errorData: ErrorDetails = await response.json();
      errorMessage = errorData.message;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}
