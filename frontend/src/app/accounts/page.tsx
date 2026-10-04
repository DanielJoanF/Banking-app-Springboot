"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Trash2,
  UserPlus,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { getAllAccounts, deleteAccount } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import type { Account } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import styles from "./accounts.module.css";

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchAccounts() {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memuat daftar akun"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter by search
  const filtered = accounts.filter(
    (acc) =>
      acc.accountHolderName.toLowerCase().includes(search.toLowerCase()) ||
      acc.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAccount(deleteTarget.id);
      toast.success(`Akun ${deleteTarget.accountHolderName} berhasil dihapus`);
      setDeleteTarget(null);
      fetchAccounts();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus akun"
      );
    } finally {
      setDeleting(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Daftar Akun</h1>
          </div>
        </div>
        <Card noPadding>
          <div className={styles.skeletonRows}>
            <Skeleton variant="row" />
            <Skeleton variant="row" />
            <Skeleton variant="row" />
            <Skeleton variant="row" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Daftar Akun</h1>
          <p>Kelola semua akun bank yang terdaftar</p>
        </div>
        <Button onClick={() => router.push("/accounts/new")}>
          <UserPlus size={18} />
          Buat Akun Baru
        </Button>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Cari nama atau nomor akun..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          id="search-accounts"
        />
      </div>

      {/* Table */}
      <Card noPadding>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Inbox size={52} />
            </div>
            <p className={styles.emptyTitle}>
              {search ? "Tidak ada hasil" : "Belum ada akun"}
            </p>
            <p className={styles.emptyText}>
              {search
                ? `Tidak ditemukan akun untuk "${search}"`
                : "Mulai dengan membuat akun baru"}
            </p>
            {!search && (
              <Button onClick={() => router.push("/accounts/new")}>
                <UserPlus size={18} />
                Buat Akun Pertama
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nama Pemilik</th>
                    <th>No. Akun</th>
                    <th>Saldo</th>
                    <th style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <div className={styles.accountName}>
                          <div className={styles.avatar}>
                            {account.accountHolderName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className={styles.nameText}>
                            {account.accountHolderName}
                          </span>
                        </div>
                      </td>
                      <td className={styles.accountNumber}>
                        {account.accountNumber}
                      </td>
                      <td className={styles.balanceCell}>
                        {formatRupiah(account.balance)}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            href={`/accounts/${account.id}`}
                            className={styles.actionBtn}
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                            onClick={() => setDeleteTarget(account)}
                            title="Hapus Akun"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.countBadge}>
              Menampilkan {filtered.length} dari {accounts.length} akun
            </div>
          </>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Akun?"
        description={`Akun "${deleteTarget?.accountHolderName}" (${deleteTarget?.accountNumber}) akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        icon={<AlertTriangle size={28} />}
        iconVariant="danger"
      >
        <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
          Batal
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Menghapus..." : "Hapus Akun"}
        </Button>
      </Modal>
    </div>
  );
}
