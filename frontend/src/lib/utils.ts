/**
 * Format angka ke format Rupiah penuh.
 * Contoh: 5000000 → "Rp 5.000.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka ke format Rupiah ringkas.
 * Contoh: 5000000 → "Rp5jt", 12500000 → "Rp12,5jt"
 */
export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return `Rp${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")}M`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `Rp${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")}jt`;
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    return `Rp${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")}rb`;
  }
  return `Rp${amount}`;
}

/**
 * Format ISO datetime string ke format Indonesia.
 * Contoh: "2026-10-04T15:00:00" → "4 Oktober 2026, 15:00"
 */
export function formatTanggal(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Menggabungkan class names, mengabaikan yang falsy.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
