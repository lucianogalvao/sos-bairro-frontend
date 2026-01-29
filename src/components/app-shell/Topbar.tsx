"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Stack,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import styles from "./topbar.module.scss";
import logo from "@/assets/sos-logo.png";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/shared/utils/getInitials";
import Link from "next/link";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";
import { useColorMode } from "@/app/providers";

type Props = {
  drawerWidth: number;
  isDesktop: boolean;
  onOpenMobile: () => void;
  onToggleDesktop: () => void;
};

export default function Topbar({
  isDesktop,
  onOpenMobile,
  onToggleDesktop,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const { mode, toggleMode } = useColorMode();
  const theme = useTheme();

  return (
    <AppBar
      color="transparent"
      position="relative"
      className={styles.appBar}
      sx={{
        width: "100%",
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Stack
            sx={{
              [theme.breakpoints.down("md")]: {
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              },
            }}
          >
            {!isDesktop && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={isDesktop ? onToggleDesktop : onOpenMobile}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}

            <Image src={logo} alt="SOS Bairro" width={120} height={36} />
          </Stack>

          <Box className={styles.user}>
            <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
              {mode === "dark" ? (
                <Brightness7RoundedIcon />
              ) : (
                <Brightness4RoundedIcon />
              )}
            </IconButton>
            <Link href="/perfil" style={{ textDecoration: "none" }}>
              <Avatar src={user?.avatarUrl ?? undefined}>
                {user ? getInitials(user.name) : ""}
              </Avatar>
            </Link>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
