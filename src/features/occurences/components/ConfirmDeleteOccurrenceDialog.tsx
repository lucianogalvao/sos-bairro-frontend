"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import type { Occurrence } from "@/features/dashboard/types";

export function ConfirmDeleteOccurrenceDialog({
  open,
  occurrence,
  isPending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  occurrence: Occurrence | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (occurrence: Occurrence) => Promise<void>;
}) {
  const title = occurrence?.description ?? "Ocorrência";

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Excluir ocorrência</DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          <Typography>
            Tem certeza que deseja excluir esta ocorrência?
          </Typography>

          <Typography variant="body2" color="text.secondary">
            “{title}”
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Essa ação não pode ser desfeita.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={isPending || !occurrence}
          onClick={async () => {
            if (!occurrence) return;
            await onConfirm(occurrence);
          }}
          startIcon={
            isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
          sx={{ fontWeight: 900 }}
        >
          {isPending ? "Excluindo..." : "Excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
