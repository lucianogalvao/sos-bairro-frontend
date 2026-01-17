import AppShell from "@/components/app-shell/AppShell";
import { AuthHydrator } from "@/shared/auth/AuthHydrator";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHydrator />
      <AppShell>{children}</AppShell>;
    </>
  );
}
