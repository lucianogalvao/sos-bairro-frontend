"use client";

import { ReactNode, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
type Props = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: Props) {
  const [mode] = useState<"light" | "dark">("dark");

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode,
            primary: {
              main: "#2563EB",
              light: "#60A5FA",
              dark: "#1E40AF",
              contrastText: "#FFFFFF",
            },
            secondary: {
              main: "#10B981",
              light: "#6EE7B7",
              dark: "#047857",
              contrastText: "#022C22",
            },
            error: { main: "#EF4444" },
            warning: { main: "#F59E0B" },
            success: { main: "#22C55E" },
            background: {
              default: mode === "dark" ? "#0F172A" : "#F8FAFC",
              paper: mode === "dark" ? "#020617" : "#FFFFFF",
            },
            text: {
              primary: mode === "dark" ? "#E5E7EB" : "#020617",
              secondary: mode === "dark" ? "#9CA3AF" : "#475569",
            },
          },
          typography: {
            fontFamily: "var(--font-montserrat)",
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            button: { fontWeight: 600, textTransform: "none" },
          },
          shape: { borderRadius: 12 },
          components: {
            MuiLink: {
              styleOverrides: {
                root: {
                  textDecoration: "none",
                  "&:hover": { textDecoration: "none" },
                  "&:focus-visible": { textDecoration: "none" },
                },
              },
            },
            MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
            MuiTextField: { defaultProps: { variant: "outlined" } },
            MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
            MuiAppBar: {
              styleOverrides: {
                root: {
                  boxShadow: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                },
              },
            },
          },
        },
        ptBR
      ),
    [mode]
  );

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
