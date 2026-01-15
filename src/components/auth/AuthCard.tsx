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
        maxWidth: 560,
        p: 6,
        borderRadius: 4,
        background: "rgba(2, 6, 23, 0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={4}
        justifyContent="center"
      >
        <Image
          src={logo}
          alt="SOS Bairro"
          width={logo.width}
          height={logo.height}
          priority
        />
      </Box>

      {children}
    </Paper>
  );
}
