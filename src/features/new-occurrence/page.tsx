"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import LayoutContainer from "../common/LayoutContainer";
import NewOccurrenceForm from "./components/NewOccurrenceForm";
import LatestOccurrencesTable from "./components/LatestOccurrencesTable";

export default function NewOccurrencePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNotebook = useMediaQuery("(max-width:1440px)");

  return (
    <LayoutContainer>
      <Stack spacing={isMobile ? 2 : 3} sx={{ width: "100%" }}>
        {/* Content */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: isMobile ? 2 : 3,
            alignItems: "stretch",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* LEFT: Form card */}
          <Box
            sx={{
              width: "100%",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Stack
              spacing={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                p: { xs: 2, md: isNotebook ? 2.5 : 3 },
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <NewOccurrenceForm />
            </Stack>
          </Box>

          {/* RIGHT: Latest occurrences card */}
          <Box
            sx={{
              width: "100%",
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              sx={{
                height: "100%",
                borderRadius: 2,
                p: { xs: 2, md: isNotebook ? 2.5 : 3 },
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                minHeight: isMobile ? "auto" : 520,
              }}
              spacing={2}
            >
              <Typography
                fontWeight={900}
                sx={{ fontSize: isNotebook ? 14 : 16 }}
              >
                Suas últimas ocorrências
              </Typography>
              <Divider sx={{ opacity: 0.6 }} />

              {/* Table needs to fill available space without overflowing */}
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <LatestOccurrencesTable />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </LayoutContainer>
  );
}
