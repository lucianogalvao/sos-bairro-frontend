"use client";

import { Box, CircularProgress } from "@mui/material";

export function LoadingBox() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={320}
      py={6}
    >
      <CircularProgress size={80} />
    </Box>
  );
}
