"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Wallet, TrendingUp, Eye, Inbox } from "lucide-react";
import { getAllAccounts } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import type { Account } from "@/lib/types";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const avgBalance = accounts.length > 0 ? totalBalance / accounts.length : 0;

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <h1 className="sr-only">Dasbor</h1>
        <div className={styles.skeletonGrid}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Card>
          <div className={styles.skeletonRows}>
            <Skeleton variant="row" />
            <Skeleton variant="row" />
            <Skeleton variant="row" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className={styles.sectionTitle}>Dasbor</h1>
        <Card>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>⚠️ {error}</p>
            <p className={styles.emptyText} style={{ marginTop: 8, fontSize: "0.8rem" }}>
              Pastikan backend berjalan di http://localhost:8080
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
        Dasbor
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 32 }}>
        Ringkasan aktivitas perbankan Anda
      </p>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Akun</span>
              <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                <Users size={20} />
              </div>
            </div>
            <div className={styles.statValue}>{accounts.length}</div>
            <div className={styles.statSub}>Akun terdaftar</div>
          </div>
        </Card>

        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Saldo</span>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                <Wallet size={20} />
              </div>
            </div>
            <div className={styles.statValue}>{formatRupiah(totalBalance)}</div>
            <div className={styles.statSub}>Seluruh akun</div>
          </div>
        </Card>

        <Card>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Rata-rata Saldo</span>
              <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className={styles.statValue}>{formatRupiah(avgBalance)}</div>
            <div className={styles.statSub}>Per akun</div>
          </div>
        </Card>
      </div>

      {/* Recent Accounts Table */}
      <Card noPadding>
        <div style={{ padding: "20px 20px 0" }}>
          <h2 className={styles.sectionTitle}>Daftar Akun</h2>
        </div>

        {accounts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Inbox size={48} />
            </div>
            <p className={styles.emptyText}>Belum ada akun terdaftar</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama Pemilik</th>
                  <th>No. Akun</th>
                  <th>Saldo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
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
                        {account.accountHolderName}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {account.accountNumber}
                    </td>
                    <td className={styles.balanceCell}>
                      {formatRupiah(account.balance)}
                    </td>
                    <td>
                      <Link
                        href={`/accounts/${account.id}`}
                        className={styles.viewLink}
                      >
                        <Eye size={16} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
