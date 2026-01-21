import { createTheme } from "@mui/material";
import { ptBR } from "@mui/material/locale";

export type AppMode = "light" | "dark";

const tokens = {
  light: {
    primary: { main: "#2563EB", hover: "#1D4ED8" },
    secondary: { main: "#eef1fb" },

    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    bg: "#F9FAFB",
    paper: "#e7e7e7",
    border: "#dfdfdf",

    textPrimary: "#121826",
    textSecondary: "#4D5562",
    textDisabled: "#9DA3AE",
  },

  dark: {
    primary: { main: "#3B82F6", hover: "#2563EB" },
    secondary: { main: "#1A2538" },

    success: "#22C55E",
    warning: "#FBC02D",
    error: "#EF4444",

    bg: "#0C1423",
    paper: "#050B17",
    border: "#22334D",

    textPrimary: "#E5E7EB",
    textSecondary: "#97A2B6",
    textDisabled: "#677389",
  },
} as const;

export function getAppTheme(mode: AppMode) {
  const t = tokens[mode];

  return createTheme(
    {
      palette: {
        mode,

        primary: { main: t.primary.main, contrastText: "#FFFFFF" },
        secondary: { main: t.secondary.main },

        success: { main: t.success },
        warning: { main: t.warning },
        error: { main: t.error },

        background: { default: t.bg, paper: t.paper },

        text: {
          primary: t.textPrimary,
          secondary: t.textSecondary,
          disabled: t.textDisabled,
        },

        divider: t.border,
      },

      typography: {
        fontFamily: "var(--font-montserrat)",
        h1: { fontWeight: 700, fontSize: "2.5rem" },
        h2: { fontWeight: 700, fontSize: "2rem" },
        h3: { fontWeight: 600, fontSize: "1.75rem" },
        h4: { fontWeight: 600, fontSize: "1.5rem" },
        h5: { fontWeight: 600, fontSize: "1.25rem" },
        h6: { fontWeight: 600, fontSize: "1rem" },
        button: { fontWeight: 600, textTransform: "none" },
      },

      shape: { borderRadius: 12 },

      components: {
        MuiCssBaseline: {
          styleOverrides: {
            ":root": { colorScheme: mode },
          },
        },

        MuiButton: {
          styleOverrides: {
            root: { borderRadius: 12 },
            containedPrimary: {
              backgroundColor: t.primary.main,
            },
          },
        },

        MuiLink: {
          styleOverrides: {
            root: {
              textDecoration: "none",
              "&:hover": { textDecoration: "none" },
              "&:focus-visible": { textDecoration: "none" },
            },
          },
        },

        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
            },
          },
        },

        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: "none",
              borderBottom: `1px solid ${t.border}`,
            },
          },
        },
      },
    },
    ptBR,
  );
}
