"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import type { User } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useDeleteUser } from "../queries";
import { ConfirmDeleteUserDialog } from "./ConfirmDeleteUserDialog";

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
  const me = useAuthStore((s) => s.user);

  const deleteUser = useDeleteUser();

  const [pendingUserId, setPendingUserId] = React.useState<number | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const isAdmin = me?.role === "ADMIN";

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
    } finally {
      setPendingUserId(null);
    }
  };

  function askDelete(u: User) {
    setDeleteError(null);
    setDeleteTarget(u);
    setDeleteOpen(true);
  }

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteTarget(null);
    setDeleteError(null);
  }

  const canDelete = (u: User) => isAdmin && me?.id !== u.id; // admin não pode se deletar

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

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <>
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

                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize={13} color="text.secondary">
                      Papel
                    </Typography>
                    <Typography fontSize={13} fontWeight={800}>
                      {isModerator ? "Moderador" : "Morador"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
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
                      sx={{ fontWeight: 900, textTransform: "none" }}
                    >
                      {isPending
                        ? "Aguarde..."
                        : isModerator
                          ? "Revogar"
                          : "Promover"}
                    </Button>

                    {canDelete(u) && (
                      <Tooltip title="Excluir usuário">
                        <IconButton
                          color="error"
                          disabled={deleteUser.isPending}
                          onClick={() => askDelete(u)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        <ConfirmDeleteUserDialog
          open={deleteOpen}
          name={deleteTarget?.name}
          isPending={deleteUser.isPending}
          error={deleteError}
          onClose={closeDelete}
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              await deleteUser.mutateAsync(deleteTarget.id);
              closeDelete();
            } catch (e) {
              setDeleteError(
                e instanceof Error ? e.message : "Erro ao excluir usuário",
              );
            }
          }}
        />
      </>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <>
      <TableContainer
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: headerBg }}>
              <TableCell sx={{ fontWeight: 900 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Papel</TableCell>
              <TableCell sx={{ fontWeight: 900, width: 200 }} align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((u) => {
              const isModerator = String(u.role).toUpperCase() === "MODERADOR";
              const isPending = pendingUserId === u.id;

              return (
                <TableRow key={u.id} sx={{ "&:hover": { bgcolor: surfaceBg } }}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{isModerator ? "Moderador" : "Morador"}</TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
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
                        }}
                      >
                        {isPending
                          ? "Aguarde..."
                          : isModerator
                            ? "Revogar"
                            : "Promover"}
                      </Button>

                      {canDelete(u) && (
                        <Tooltip title="Excluir usuário">
                          <IconButton
                            color="error"
                            disabled={deleteUser.isPending}
                            onClick={() => askDelete(u)}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDeleteUserDialog
        open={deleteOpen}
        name={deleteTarget?.name}
        isPending={deleteUser.isPending}
        error={deleteError}
        onClose={closeDelete}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteUser.mutateAsync(deleteTarget.id);
            closeDelete();
          } catch (e) {
            setDeleteError(
              e instanceof Error ? e.message : "Erro ao excluir usuário",
            );
          }
        }}
      />
    </>
  );
}
