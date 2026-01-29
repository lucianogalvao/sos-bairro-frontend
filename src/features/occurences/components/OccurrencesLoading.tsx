"use client";

import { Box, CircularProgress } from "@mui/material";
import LayoutContainer from "../../common/LayoutContainer";

export function OccurrencesLoading() {
  return (
    <LayoutContainer>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress size={100} />
      </Box>
    </LayoutContainer>
  );
}
