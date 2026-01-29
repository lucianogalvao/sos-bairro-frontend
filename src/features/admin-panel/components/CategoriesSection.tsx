"use client";

import * as React from "react";
import {
  Box,
  Button,
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

import type { OccurrenceCategory } from "@/features/dashboard/types";

export function CategoriesSection({
  isMobile,
  rows,
  pendingDeleteId,
  setPendingDeleteId,
  setCategoriesDeleteError,
  isDeleting,
  onDeleteCategory,
}: {
  isMobile: boolean;
  rows: Array<OccurrenceCategory & { occurrencesCount: number }>;
  pendingDeleteId: number | null;
  setPendingDeleteId: (v: number | null) => void;
  setCategoriesDeleteError: (v: string | null) => void;
  isDeleting: boolean;
  onDeleteCategory: (categoryId: number) => Promise<void>;
}) {
  const theme = useTheme();

  const surfaceBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(2,6,23,0.03)";

  const headerBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(2,6,23,0.06)";

  const handleAskDelete = (id: number) => {
    setCategoriesDeleteError(null);
    setPendingDeleteId(id);
  };

  const handleCancelDelete = () => setPendingDeleteId(null);

  const handleConfirmDelete = async (
    c: OccurrenceCategory & { occurrencesCount: number },
  ) => {
    if (c.occurrencesCount > 0) {
      setCategoriesDeleteError(
        "Só é possível deletar categorias sem ocorrências.",
      );
      setPendingDeleteId(null);
      return;
    }

    await onDeleteCategory(c.id);
    setPendingDeleteId(null);
    setCategoriesDeleteError(null);
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
          Nenhuma categoria encontrada.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={1.25}>
        {rows.map((c) => {
          const isConfirming = pendingDeleteId === c.id;

          return (
            <Box
              key={c.id}
              sx={{
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                p: 1.5,
                bgcolor: surfaceBg,
              }}
            >
              <Stack spacing={1}>
                <Typography fontWeight={900} fontSize={14}>
                  {c.title}
                </Typography>

                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography fontSize={13} color="text.secondary">
                    Risco
                  </Typography>
                  <Typography fontSize={13} fontWeight={800}>
                    {c.riskLevel}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography fontSize={13} color="text.secondary">
                    Ocorrências
                  </Typography>
                  <Typography fontSize={13} fontWeight={800}>
                    {c.occurrencesCount}
                  </Typography>
                </Stack>

                {isConfirming ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      fullWidth
                      disabled={isDeleting}
                      onClick={() => handleConfirmDelete(c)}
                    >
                      {isDeleting ? "Excluindo..." : "Confirmar"}
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disabled={isDeleting}
                      onClick={handleCancelDelete}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    sx={{
                      fontWeight: 900,
                      textTransform: "none",
                      borderRadius: 0.75,
                    }}
                    onClick={() => handleAskDelete(c.id)}
                  >
                    Excluir
                  </Button>
                )}
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
      <Table size="small" aria-label="tabela de categorias">
        <TableHead>
          <TableRow sx={{ bgcolor: headerBg }}>
            <TableCell sx={{ fontWeight: 900 }}>Título</TableCell>
            <TableCell sx={{ fontWeight: 900, width: 220 }}>Risco</TableCell>
            <TableCell sx={{ fontWeight: 900, width: 130 }}>
              Ocorrências
            </TableCell>
            <TableCell sx={{ fontWeight: 900, width: 160 }} align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((c) => {
            const isConfirming = pendingDeleteId === c.id;

            return (
              <TableRow
                key={c.id}
                sx={{
                  "&:hover": {
                    bgcolor: surfaceBg,
                  },
                }}
              >
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.riskLevel}</TableCell>
                <TableCell>{c.occurrencesCount}</TableCell>

                <TableCell align="right">
                  {isConfirming ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={isDeleting}
                        onClick={() => handleConfirmDelete(c)}
                      >
                        {isDeleting ? "Excluindo..." : "Confirmar"}
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        disabled={isDeleting}
                        onClick={handleCancelDelete}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        minWidth: 110,
                        fontWeight: 900,
                        textTransform: "none",
                        borderRadius: 0.75,
                      }}
                      onClick={() => handleAskDelete(c.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
