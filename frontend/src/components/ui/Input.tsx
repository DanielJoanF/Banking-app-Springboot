import { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export default function Input({
  label,
  error,
  prefix,
  id,
  className,
  ...props
}: InputProps) {
  return (
    <div className={cn(styles.wrapper, error && styles.error, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={id}
          className={cn(styles.input, prefix && styles.hasPrefix)}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
