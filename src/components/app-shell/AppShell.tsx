"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./app-shell.module.scss";

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 88;

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const mounted = useMounted();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const effectiveIsMobile = mounted ? isMobile : false;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  const drawerWidth = useMemo(() => {
    if (effectiveIsMobile) return DRAWER_WIDTH_EXPANDED;
    return desktopExpanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;
  }, [desktopExpanded, effectiveIsMobile]);

  return (
    <Box className={styles.root}>
      <Sidebar
        variant={effectiveIsMobile ? "temporary" : "permanent"}
        drawerWidth={drawerWidth}
        expanded={!effectiveIsMobile && desktopExpanded}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleDesktop={() => setDesktopExpanded((v) => !v)}
      />

      <Box className={styles.main}>
        <Topbar
          drawerWidth={drawerWidth}
          isDesktop={!effectiveIsMobile}
          onOpenMobile={() => setMobileOpen(true)}
          onToggleDesktop={() => setDesktopExpanded((v) => !v)}
        />
        <Box component="main" className={styles.content}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
