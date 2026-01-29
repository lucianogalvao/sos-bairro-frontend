"use client";

import { Button, Stack, Typography } from "@mui/material";
import type { AdminTab } from "./AdminTabs";

export function AdminHeader({
  title,
  activeTab,
  onNewCategory,
}: {
  title: string;
  activeTab: AdminTab;
  onNewCategory: () => void;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      gap={1}
    >
      <Typography fontSize={{ xs: 20, sm: 24 }} fontWeight={900}>
        {title}
      </Typography>

      {activeTab === "categories" ? (
        <Button
          variant="contained"
          onClick={onNewCategory}
          sx={{
            fontWeight: 900,
            textTransform: "none",
            borderRadius: 0.75,
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          Nova categoria
        </Button>
      ) : null}
    </Stack>
  );
}
