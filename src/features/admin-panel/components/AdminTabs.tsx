"use client";

import { Button, Stack } from "@mui/material";

export type AdminTab = "users" | "categories";

export function AdminTabs({
  activeTab,
  onChange,
}: {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ flexWrap: "wrap", rowGap: 1 }}
    >
      <Button
        size="small"
        onClick={() => onChange("users")}
        variant={activeTab === "users" ? "contained" : "outlined"}
        sx={{
          borderRadius: 999,
          px: 2,
          fontWeight: 800,
          textTransform: "none",
        }}
      >
        Usuários
      </Button>

      <Button
        size="small"
        onClick={() => onChange("categories")}
        variant={activeTab === "categories" ? "contained" : "outlined"}
        sx={{
          borderRadius: 999,
          px: 2,
          fontWeight: 800,
          textTransform: "none",
        }}
      >
        Categorias
      </Button>
    </Stack>
  );
}
