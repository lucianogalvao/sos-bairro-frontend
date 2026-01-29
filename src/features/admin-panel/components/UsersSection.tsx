"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

import type { User } from "../types";

export function UsersSection({
  isMobile,
  rows,
  onToggleRole,
}: {
  isMobile: boolean;
  rows: User[];
  onToggleRole: (u: User) => Promise<void>;
}) {
  const theme = useTheme();

  const [pendingUserId, setPendingUserId] = React.useState<
    string | number | null
  >(null);

  const surfaceBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(2,6,23,0.03)";

  const headerBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(2,6,23,0.06)";

  const handleToggle = async (u: User) => {
    try {
      setPendingUserId(u.id);
      await onToggleRole(u);
    } catch (e) {
      console.error(e);
    } finally {
      setPendingUserId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          p: 2,
        }}
      >
        <Typography color="text.secondary">
          Nenhum usuário encontrado.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={1.25}>
        {rows.map((u) => {
          const isModerator = String(u.role).toUpperCase() === "MODERADOR";
          const isPending = pendingUserId === u.id;

          return (
            <Box
              key={u.id}
              sx={{
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                p: 1.5,
                bgcolor: surfaceBg,
              }}
            >
              <Stack spacing={1}>
                <Stack spacing={0.25}>
                  <Typography fontWeight={900} fontSize={14}>
                    {u.name}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {u.email}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography fontSize={13} color="text.secondary">
                    Papel
                  </Typography>
                  <Typography fontSize={13} fontWeight={800}>
                    {isModerator ? "Moderador" : "Morador"}
                  </Typography>
                </Stack>

                <Button
                  variant="outlined"
                  size="small"
                  color={isModerator ? "error" : "primary"}
                  fullWidth
                  disabled={isPending}
                  onClick={() => handleToggle(u)}
                  startIcon={
                    isPending ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                  sx={{
                    fontWeight: 900,
                    textTransform: "none",
                    borderRadius: 0.75,
                  }}
                >
                  {isPending
                    ? "Aguarde..."
                    : isModerator
                      ? "Revogar"
                      : "Promover"}
                </Button>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    );
  }

  return (
    <TableContainer
      sx={{
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      <Table size="small" aria-label="tabela de usuários">
        <TableHead>
          <TableRow sx={{ bgcolor: headerBg }}>
            <TableCell sx={{ fontWeight: 900 }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 900 }}>Papel</TableCell>
            <TableCell sx={{ fontWeight: 900, width: 140 }} align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((u) => {
            const isModerator = String(u.role).toUpperCase() === "MODERADOR";
            const isPending = pendingUserId === u.id;

            return (
              <TableRow
                key={u.id}
                sx={{
                  "&:hover": {
                    bgcolor: surfaceBg,
                  },
                }}
              >
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{isModerator ? "Moderador" : "Morador"}</TableCell>

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    color={isModerator ? "error" : "primary"}
                    disabled={isPending}
                    onClick={() => handleToggle(u)}
                    startIcon={
                      isPending ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                    sx={{
                      minWidth: 120,
                      fontWeight: 900,
                      textTransform: "none",
                      borderRadius: 0.75,
                    }}
                  >
                    {isPending
                      ? "Aguarde..."
                      : isModerator
                        ? "Revogar"
                        : "Promover"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
