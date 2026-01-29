"use client";

import { Button, CircularProgress, Stack } from "@mui/material";

export function ProfileActions({
  isEditing,
  isSaving,
  canSave,
  onCancel,
  onSave,
}: {
  isEditing: boolean;
  isSaving: boolean;
  canSave: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (!isEditing) return null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isSaving}
        fullWidth
        sx={{ textTransform: "none", fontWeight: 900 }}
      >
        Cancelar
      </Button>

      <Button
        variant="contained"
        onClick={onSave}
        disabled={!canSave || isSaving}
        fullWidth
        startIcon={
          isSaving ? <CircularProgress size={18} color="inherit" /> : undefined
        }
        sx={{ textTransform: "none", fontWeight: 900 }}
      >
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </Stack>
  );
}
