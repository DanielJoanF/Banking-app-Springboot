"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createAccount } from "@/lib/api";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import styles from "./new.module.css";

interface FormErrors {
  accountNumber?: string;
  accountHolderName?: string;
  balance?: string;
}

export default function NewAccountPage() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Nomor akun wajib diisi";
    }
    if (!accountHolderName.trim()) {
      newErrors.accountHolderName = "Nama pemilik wajib diisi";
    }
    if (!balance.trim()) {
      newErrors.balance = "Saldo awal wajib diisi";
    } else if (isNaN(Number(balance)) || Number(balance) < 0) {
      newErrors.balance = "Saldo harus berupa angka positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createAccount({
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim(),
        balance: Number(balance),
      });
      toast.success("Akun berhasil dibuat!");
      router.push("/accounts");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal membuat akun"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/accounts" className={styles.backLink}>
        <ArrowLeft size={16} />
        Kembali ke Daftar Akun
      </Link>

      <h1 className={styles.title}>Buat Akun Baru</h1>
      <p className={styles.subtitle}>
        Isi data di bawah untuk mendaftarkan akun bank baru
      </p>

      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="accountNumber"
            label="Nomor Akun"
            placeholder="Contoh: ACC1003"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              if (errors.accountNumber) setErrors({ ...errors, accountNumber: undefined });
            }}
            error={errors.accountNumber}
          />

          <Input
            id="accountHolderName"
            label="Nama Pemilik"
            placeholder="Contoh: Rian Pratama"
            value={accountHolderName}
            onChange={(e) => {
              setAccountHolderName(e.target.value);
              if (errors.accountHolderName) setErrors({ ...errors, accountHolderName: undefined });
            }}
            error={errors.accountHolderName}
          />

          <Input
            id="balance"
            label="Saldo Awal"
            type="number"
            placeholder="0"
            prefix="Rp"
            min="0"
            step="1000"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
              if (errors.balance) setErrors({ ...errors, balance: undefined });
            }}
            error={errors.balance}
          />

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/accounts")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              <Save size={18} />
              {submitting ? "Menyimpan..." : "Simpan Akun"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
