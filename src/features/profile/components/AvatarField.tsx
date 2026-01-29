// src/features/profile/components/AvatarField.tsx
"use client";

import { Button, Stack, Typography } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export function AvatarField({
  isEditing,
  isSaving,
  onPickFile,
  hasPreview,
  canRemove,
  onRemove,
}: {
  isEditing: boolean;
  isSaving: boolean;
  onPickFile: (file: File | null) => void;
  hasPreview: boolean;
  canRemove: boolean;
  onRemove: () => void;
}) {
  if (!isEditing) return null;

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Foto de perfil
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
        disabled={isSaving}
      />

      {hasPreview ? (
        <Typography variant="caption" color="text.secondary">
          Preview da imagem selecionada
        </Typography>
      ) : null}

      <Button
        variant="outlined"
        color="error"
        onClick={onRemove}
        disabled={isSaving || !canRemove}
        startIcon={<DeleteOutlineOutlinedIcon fontSize="small" />}
        sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 900 }}
      >
        Remover foto
      </Button>
    </Stack>
  );
}
