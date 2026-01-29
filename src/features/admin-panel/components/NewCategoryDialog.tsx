"use client";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { RiskLevel } from "../../dashboard/types";

export function NewCategoryDialog({
  open,
  onClose,
  title,
  setTitle,
  risk,
  setRisk,
  error,
  setError,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  setTitle: (v: string) => void;
  risk: RiskLevel;
  setRisk: (v: RiskLevel) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onSubmit: (payload: { title: string; riskLevel: RiskLevel }) => Promise<void>;
  isPending: boolean;
}) {
  async function handleSubmit() {
    try {
      setError(null);

      const cleanTitle = title.trim();
      if (!cleanTitle) {
        setError("Informe um título");
        return;
      }

      await onSubmit({ title: cleanTitle, riskLevel: risk });
      onClose();
      setTitle("");
      setRisk("MEDIO");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao criar categoria");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Nova categoria</DialogTitle>

      <DialogContent sx={{ pt: "10px !important" }}>
        <Stack spacing={1.25}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            fullWidth
          />

          <TextField
            label="Risco"
            select
            value={risk}
            onChange={(e) => setRisk(e.target.value as RiskLevel)}
            fullWidth
          >
            <MenuItem value="BAIXO">Baixo</MenuItem>
            <MenuItem value="MEDIO">Médio</MenuItem>
            <MenuItem value="ALTO">Alto</MenuItem>
          </TextField>

          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
          sx={{ fontWeight: 900 }}
        >
          {isPending ? "Salvando..." : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
