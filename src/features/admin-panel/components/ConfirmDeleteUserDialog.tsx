"use client";

import * as React from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export function ConfirmDeleteUserDialog({
  open,
  name,
  isPending,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name?: string | null;
  isPending: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Excluir usuário</DialogTitle>

      <DialogContent>
        <Stack spacing={1.25}>
          <Typography variant="body2" color="text.secondary">
            Essa ação é irreversível.
          </Typography>

          <Alert severity="warning">
            Tem certeza que deseja excluir{" "}
            <strong>{name?.trim() ? name : "este usuário"}</strong>?
          </Alert>

          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {isPending ? "Excluindo..." : "Excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
