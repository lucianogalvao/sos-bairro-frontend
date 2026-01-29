"use client";

import { Box, Pagination } from "@mui/material";

export function OccurrencesPagination({
  page,
  totalPages,
  onChange,
  isMobile,
}: {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
  isMobile: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: { xs: 1.5, md: 2 },
        flexShrink: 0,
      }}
    >
      <Pagination
        page={page}
        count={totalPages}
        onChange={(_, next) => onChange(next)}
        size={isMobile ? "small" : "medium"}
      />
    </Box>
  );
}
