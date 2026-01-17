"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export function AuthHydrator() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (!isHydrated) void hydrate();
  }, [isHydrated, hydrate]);

  return null;
}
