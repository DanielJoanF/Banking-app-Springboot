import styles from "./Skeleton.module.css";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: "text" | "title" | "card" | "row" | "circle";
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({
  variant = "text",
  width,
  height,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
    />
  );
}
