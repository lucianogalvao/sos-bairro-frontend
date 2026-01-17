"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutPage() {
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });

        await new Promise((resolve) => setTimeout(resolve, 1500));
      } finally {
        if (!alive) return;

        clearUser();
        router.replace("/login");
      }
    })();

    return () => {
      alive = false;
    };
  }, [clearUser, router]);

  return (
    <Box
      minHeight="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={2}
    >
      <CircularProgress />
      <Typography color="text.secondary">Encerrando sua sessão...</Typography>
    </Box>
  );
}
