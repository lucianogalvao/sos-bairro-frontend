"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import LayoutContainer from "@/features/common/LayoutContainer";

export default function NotFound() {
  const theme = useTheme();

  return (
    <LayoutContainer>
      <Box
        p={{ xs: 2, sm: 2.25, md: 3 }}
        borderRadius={0.5}
        bgcolor={theme.palette.background.paper}
        minHeight="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 760,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(2,6,23,0.02)",
            p: { xs: 2.25, sm: 3, md: 3.25 },
          }}
        >
          <Stack spacing={1.6} alignItems="center" textAlign="center">
            <Typography fontWeight={900} sx={{ fontSize: { xs: 42, sm: 54 } }}>
              404
            </Typography>

            <Stack spacing={0.6} alignItems="center">
              <Typography
                fontWeight={900}
                sx={{ fontSize: { xs: 20, sm: 26 } }}
              >
                Página não encontrada
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ maxWidth: 560, fontSize: { xs: 13.5, sm: 14.5 } }}
              >
                O endereço que você tentou acessar não existe, foi movido ou
                está temporariamente indisponível.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ maxWidth: 560, fontSize: { xs: 13.5, sm: 14.5 } }}
              >
                Se você chegou aqui por um link dentro do app, pode ser que ele
                esteja desatualizado. Volte para uma área segura e continue sua
                navegação.
              </Typography>
            </Stack>

            <Box
              sx={{
                height: 1,
                width: "100%",
                bgcolor: theme.palette.divider,
                my: 0.5,
                maxWidth: 640,
              }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ pt: 0.75, width: "100%", justifyContent: "center" }}
            >
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                sx={{
                  fontWeight: 900,
                  textTransform: "none",
                  borderRadius: 0.75,
                  width: { xs: "100%", sm: 220 },
                }}
              >
                Ir para o Dashboard
              </Button>

              <Button
                component={Link}
                href="/occurrences"
                variant="outlined"
                sx={{
                  fontWeight: 900,
                  textTransform: "none",
                  borderRadius: 0.75,
                  width: { xs: "100%", sm: 220 },
                }}
              >
                Ver Ocorrências
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </LayoutContainer>
  );
}
