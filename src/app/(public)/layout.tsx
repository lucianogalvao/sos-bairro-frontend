import type { ReactNode } from "react";
import styles from "./auth.module.scss";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
