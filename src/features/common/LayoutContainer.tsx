import React from "react";

import styles from "./styles/layout-container.module.scss";

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
