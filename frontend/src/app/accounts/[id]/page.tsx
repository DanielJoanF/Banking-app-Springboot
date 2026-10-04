"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getAccountById,
  deposit as apiDeposit,
  withdraw as apiWithdraw,
  deleteAccount,
} from "@/lib/api";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import type { Account } from "@/lib/types";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import styles from "./detail.module.css";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchAccount() {
    try {
      const data = await getAccountById(id);
      setAccount(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Akun tidak ditemukan"
      );
      router.push("/accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle deposit
  async function handleDeposit(e: FormEvent) {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan jumlah deposit yang valid");
      return;
    }
    setDepositLoading(true);
    try {
      const updated = await apiDeposit(id, amount);
      setAccount(updated);
      setDepositAmount("");
      toast.success(`Berhasil deposit ${formatRupiah(amount)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal melakukan deposit");
    } finally {
      setDepositLoading(false);
    }
  }

  // Handle withdraw
  async function handleWithdraw(e: FormEvent) {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan jumlah penarikan yang valid");
      return;
    }
    setWithdrawLoading(true);
    try {
      const updated = await apiWithdraw(id, amount);
      setAccount(updated);
      setWithdrawAmount("");
      toast.success(`Berhasil menarik ${formatRupiah(amount)}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal melakukan penarikan"
      );
    } finally {
      setWithdrawLoading(false);
    }
  }

  // Handle delete
  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteAccount(id);
      toast.success("Akun berhasil dihapus");
      router.push("/accounts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus akun");
    } finally {
      setDeleteLoading(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <div>
        <div className={styles.backLink}>← Kembali</div>
        <Card>
          <div className={styles.skeletonInfo}>
            <Skeleton variant="circle" width="64px" height="64px" />
            <Skeleton variant="title" width="200px" />
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="title" width="250px" height="40px" />
          </div>
        </Card>
        <div className={styles.skeletonGrid}>
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="200px" />
        </div>
      </div>
    );
  }

  if (!account) return null;

  const initials = account.accountHolderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div>
      <Link href="/accounts" className={styles.backLink}>
        <ArrowLeft size={16} />
        Kembali ke Daftar Akun
      </Link>

      {/* Account Info */}
      <Card className={styles.accountInfo}>
        <div className={styles.avatarLarge}>{initials}</div>
        <h1 className={styles.holderName}>{account.accountHolderName}</h1>
        <p className={styles.accountNumber}>{account.accountNumber}</p>
        <p className={styles.balanceLabel}>Saldo Tersedia</p>
        <p className={styles.balanceValue}>{formatRupiah(account.balance)}</p>
        <p className={styles.createdAt}>
          Dibuat: {formatTanggal(account.createdAt)}
        </p>
      </Card>

      {/* Transaction Forms */}
      <div className={styles.transactionGrid}>
        {/* Deposit */}
        <Card className={`${styles.transactionCard} ${styles.depositCard}`}>
          <div className={styles.transactionTitle}>
            <div className={styles.transactionIconDeposit}>
              <ArrowDownToLine size={20} />
            </div>
            Deposit
          </div>
          <form onSubmit={handleDeposit} className={styles.transactionForm}>
            <Input
              id="deposit-amount"
              label="Jumlah Deposit"
              type="number"
              placeholder="0"
              prefix="Rp"
              min="1"
              step="1000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Button type="submit" disabled={depositLoading} fullWidth>
              <ArrowDownToLine size={18} />
              {depositLoading ? "Memproses..." : "Deposit"}
            </Button>
          </form>
        </Card>

        {/* Withdraw */}
        <Card className={`${styles.transactionCard} ${styles.withdrawCard}`}>
          <div className={styles.transactionTitle}>
            <div className={styles.transactionIconWithdraw}>
              <ArrowUpFromLine size={20} />
            </div>
            Tarik Saldo
          </div>
          <form onSubmit={handleWithdraw} className={styles.transactionForm}>
            <Input
              id="withdraw-amount"
              label="Jumlah Penarikan"
              type="number"
              placeholder="0"
              prefix="Rp"
              min="1"
              step="1000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button type="submit" disabled={withdrawLoading} fullWidth>
              <ArrowUpFromLine size={18} />
              {withdrawLoading ? "Memproses..." : "Tarik Saldo"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <div>
            <p className={styles.dangerTitle}>Zona Berbahaya</p>
            <p className={styles.dangerText}>
              Menghapus akun akan menghilangkan semua data secara permanen
            </p>
          </div>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={18} />
            Hapus Akun
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Akun?"
        description={`Akun "${account.accountHolderName}" (${account.accountNumber}) dengan saldo ${formatRupiah(account.balance)} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        icon={<AlertTriangle size={28} />}
        iconVariant="danger"
      >
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Batal
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Menghapus..." : "Hapus Permanen"}
        </Button>
      </Modal>
    </div>
  );
}
