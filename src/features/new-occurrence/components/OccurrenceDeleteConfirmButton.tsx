"use client";

import * as React from "react";
import { Box, Button, Collapse, Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
  occurrence: { id: number } & Record<string, unknown>;
  onDelete: (id: number) => Promise<void> | void;
  disabled?: boolean;
};

export default function OccurrenceDeleteConfirmButton({
  occurrence,
  onDelete,
  disabled,
}: Props) {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleOpenConfirm() {
    setOpenConfirm(true);
  }

  function handleCancel() {
    setOpenConfirm(false);
  }

  async function handleConfirm() {
    try {
      setIsSubmitting(true);
      await onDelete(occurrence.id);
      setOpenConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box>
      <Button
        size="small"
        color="error"
        variant="text"
        startIcon={<DeleteOutlineIcon />}
        onClick={handleOpenConfirm}
        disabled={disabled || isSubmitting}
        sx={{ px: 1, minWidth: 0 }}
      >
        Excluir
      </Button>

      <Collapse in={openConfirm} timeout={180} unmountOnExit>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleConfirm}
            disabled={disabled || isSubmitting}
          >
            Confirmar
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
}
