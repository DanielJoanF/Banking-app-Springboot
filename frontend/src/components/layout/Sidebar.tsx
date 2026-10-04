"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Landmark,
  Menu,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { href: "/accounts", label: "Daftar Akun", icon: Users },
  { href: "/accounts/new", label: "Buat Akun", icon: UserPlus },
];

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={cn(styles.overlay, !isOpen && styles.overlayHidden)}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(styles.sidebar, isOpen && styles.sidebarOpen)}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Landmark size={22} />
          </div>
          <div>
            <div className={styles.logoText}>BankApp</div>
            <div className={styles.logoSub}>Internet Banking</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href === "/accounts" && pathname === "/accounts") ||
              (item.href === "/accounts/new" && pathname === "/accounts/new");

            // Special case: /accounts should be active for /accounts but not /accounts/new
            const isAccountsList = item.href === "/accounts";
            const isAccountsActive = isAccountsList
              ? pathname === "/accounts" || (pathname.startsWith("/accounts/") && pathname !== "/accounts/new")
              : pathname === item.href;

            const finalActive = isAccountsList ? isAccountsActive : isActive;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  styles.navLink,
                  finalActive && styles.navLinkActive
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Banking App © 2026
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>{children}</main>
    </>
  );
}
