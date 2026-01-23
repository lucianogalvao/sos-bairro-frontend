"use client";

import Image from "next/image";
import { Paper, Box } from "@mui/material";
import logo from "@/assets/sos-logo.png";

type Props = {
  children: React.ReactNode;
};

export function AuthCard({ children }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 420, md: 560 },
        p: { xs: 3, sm: 4, md: 4, nb: 4 },
        mx: { xs: 2, sm: "auto" },
        borderRadius: { xs: 3, md: 4 },
        background: "rgba(2, 6, 23, 0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: {
          xs: "0 12px 32px rgba(0,0,0,0.35)",
          md: "0 30px 80px rgba(0,0,0,0.45)",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={{ xs: 1.5, md: 2 }}
        mb={{ xs: 2.5, md: 4 }}
        justifyContent="center"
      >
        <Image src={logo} alt="SOS Bairro" width={160} height={48} priority />
      </Box>

      {children}
    </Paper>
  );
}
