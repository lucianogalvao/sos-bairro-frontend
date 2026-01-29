"use client";

import {
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { Role } from "@/store/types";

export function AdminFilters({
  activeTab,
  filterText,
  onFilterTextChange,
  roleFilter,
  onRoleFilterChange,
}: {
  activeTab: "categories" | "users";
  filterText: string;
  onFilterTextChange: (v: string) => void;
  roleFilter: Role | "";
  onRoleFilterChange: (v: Role | "") => void;
}) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.25}
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{
        p: 1,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.02)"
            : "rgba(2,6,23,0.02)",
      }}
    >
      <TextField
        size="small"
        placeholder="Filtrar"
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {activeTab === "users" ? (
        <TextField
          size="small"
          select
          value={roleFilter}
          onChange={(e) =>
            onRoleFilterChange((e.target.value as Role | "") ?? "")
          }
          sx={{ width: { xs: "100%", sm: 190 } }}
        >
          <MenuItem value="">Papel</MenuItem>
          <MenuItem value="MODERADOR">Moderador</MenuItem>
          <MenuItem value="MORADOR">Morador</MenuItem>
        </TextField>
      ) : null}
    </Stack>
  );
}
