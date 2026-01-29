"use client";

import Link from "next/link";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import type {
  OccurrenceCategory,
  OccurrenceStatus,
} from "@/features/dashboard/types";

export function OccurrencesToolbar({
  isNotebook,
  search,
  setSearch,
  status,
  setStatus,
  categoryId,
  setCategoryId,
  categories,
  categoriesIsError,
  categoriesIsLoading,
  categoriesErrorMessage,
  onReset,
}: {
  isNotebook: boolean;
  search: string;
  setSearch: (v: string) => void;
  status: "" | OccurrenceStatus;
  setStatus: (v: "" | OccurrenceStatus) => void;
  categoryId: number | "";
  setCategoryId: (v: number | "") => void;
  categories: OccurrenceCategory[];
  categoriesIsError: boolean;
  categoriesIsLoading: boolean;
  categoriesErrorMessage: string | null;
  onReset: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: { xs: 1, md: isNotebook ? 1 : 1.25 },
        mb: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{
          width: "100%",
          flexWrap: { sm: "wrap", md: isNotebook ? "wrap" : "nowrap" },
          rowGap: 1.25,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListRoundedIcon fontSize="small" />
          <Typography fontWeight={700}>Filtrar</Typography>
        </Stack>

        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          placeholder="Descrição..."
          sx={{
            width: { xs: "100%", sm: 260 },
            "& .MuiInputBase-root": { height: 36 },
          }}
        />

        <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
          <Select
            value={status}
            onChange={(e) =>
              setStatus((e.target.value as OccurrenceStatus) ?? "")
            }
            displayEmpty
            sx={{ height: 36 }}
          >
            <MenuItem value="">Status</MenuItem>
            <MenuItem value="REGISTRADA">Registrada</MenuItem>
            <MenuItem value="EM_ANALISE">Em análise</MenuItem>
            <MenuItem value="RESOLVIDA">Resolvida</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
          <Select
            value={categoryId}
            onChange={(e) => {
              const value = e.target.value as unknown as string;
              setCategoryId(value === "" ? "" : Number(value));
            }}
            displayEmpty
            sx={{ height: 36 }}
          >
            <MenuItem value="">Categoria</MenuItem>

            {categoriesIsError && (
              <MenuItem value="" disabled>
                Erro ao carregar categorias
              </MenuItem>
            )}

            {!categoriesIsLoading &&
              !categoriesIsError &&
              categories.length === 0 && (
                <MenuItem value="" disabled>
                  Nenhuma categoria encontrada
                </MenuItem>
              )}

            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {categoriesIsError && categoriesErrorMessage ? (
          <Typography variant="caption" color="error" sx={{ mt: -0.5 }}>
            {categoriesErrorMessage}
          </Typography>
        ) : null}

        <Button
          size="small"
          onClick={onReset}
          sx={{
            height: 36,
            alignSelf: { xs: "stretch", sm: "auto" },
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          Limpar
        </Button>
      </Stack>

      <Button
        component={Link}
        href="/nova-ocorrencia"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          height: 36,
          whiteSpace: "nowrap",
          mt: { xs: 1, md: 0 },
          alignSelf: { xs: "stretch", md: "auto" },
        }}
      >
        Nova Ocorrência
      </Button>
    </Box>
  );
}
