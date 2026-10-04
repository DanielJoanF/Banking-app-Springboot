"use client";

import { ReactNode, useEffect } from "react";
import styles from "./Modal.module.css";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  iconVariant?: "danger" | "warning";
  children?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconVariant = "danger",
  children,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {icon && (
          <div
            className={cn(
              styles.iconWrapper,
              iconVariant === "danger" ? styles.iconDanger : styles.iconWarning
            )}
          >
            {icon}
          </div>
        )}
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.actions}>{children}</div>
      </div>
    </div>
  );
}
