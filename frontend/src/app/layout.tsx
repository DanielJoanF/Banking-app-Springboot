import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import SidebarLayout from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankApp — Internet Banking",
  description:
    "Aplikasi perbankan digital dengan fitur manajemen akun, deposit, dan penarikan saldo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1e3f",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
