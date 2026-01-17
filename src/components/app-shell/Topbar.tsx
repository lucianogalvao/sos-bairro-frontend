"use client";

import { AppBar, Toolbar, IconButton, Avatar, Box, Stack } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import styles from "./topbar.module.scss";
import logo from "@/assets/sos-logo.png";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/shared/utils/getInitials";
import Link from "next/link";

type Props = {
  drawerWidth: number;
  isDesktop: boolean;
  onOpenMobile: () => void;
  onToggleDesktop: () => void;
};

export default function Topbar({
  drawerWidth,
  isDesktop,
  onOpenMobile,
  onToggleDesktop,
}: Props) {
  const user = useAuthStore((s) => s.user);
  return (
    <AppBar
      position="fixed"
      className={styles.appBar}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Stack>
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
            <Link href="/perfil" style={{ textDecoration: "none" }}>
              <Avatar>{user ? getInitials(user.name) : ""}</Avatar>
            </Link>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
