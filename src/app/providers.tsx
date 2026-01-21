"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { getAppTheme, type AppMode } from "@/theme/getAppTheme";

type Props = {
  children: ReactNode;
  initialMode: AppMode;
};

type ColorModeContextValue = {
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorMode() {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within AppThemeProvider");
  }
  return ctx;
}

function persistMode(mode: AppMode) {
  document.documentElement.dataset.theme = mode;
  document.cookie = `sos_mode=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem("sos_mode", mode);
  } catch {}
}

export function AppThemeProvider({ children, initialMode }: Props) {
  const [mode, setModeState] = useState<AppMode>(initialMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    persistMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persistMode(next);
      return next;
    });
  }, []);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode],
  );

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ColorModeContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
