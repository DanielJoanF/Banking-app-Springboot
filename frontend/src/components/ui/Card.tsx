import { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  noPadding?: boolean;
  children: ReactNode;
}

export default function Card({
  hoverable = false,
  noPadding = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        hoverable && styles.hoverable,
        noPadding && styles.noPadding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
