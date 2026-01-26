"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./sidebar.module.scss";
import { useAuthStore } from "@/store/useAuthStore";
import { JSX } from "react";

type Props = {
  variant: "permanent" | "temporary";
  drawerWidth: number;
  expanded: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleDesktop: () => void;
};

const ICON_SIZE = 36;

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: <HomeRoundedIcon sx={{ fontSize: ICON_SIZE }} />,
    roles: ["ADMIN", "MODERADOR", "MORADOR"],
  },
  {
    href: "/ocorrencias",
    label: "Ocorrências",
    icon: <ReportRoundedIcon sx={{ fontSize: ICON_SIZE }} />,
    roles: ["ADMIN", "MODERADOR", "MORADOR"],
  },
  {
    href: "/usuarios",
    label: "Usuários",
    icon: <PeopleAltRoundedIcon sx={{ fontSize: ICON_SIZE }} />,
    roles: ["ADMIN", "MODERADOR"],
  },
];

const bottomItems = [
  {
    href: "/perfil",
    label: "Perfil",
    icon: <PermIdentityOutlinedIcon sx={{ fontSize: ICON_SIZE }} />,
  },
  {
    href: "/logout",
    label: "Sair",
    icon: <LogoutRoundedIcon sx={{ fontSize: ICON_SIZE }} />,
  },
];

export default function Sidebar({
  variant,
  drawerWidth,
  expanded,
  mobileOpen,
  onCloseMobile,
  onToggleDesktop,
}: Props) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const renderItemButton = (item: {
    href: string;
    label: string;
    icon: JSX.Element;
  }) => {
    const isActive = pathname === item.href;

    const btn = (
      <ListItemButton
        key={item.href}
        component={Link}
        href={item.href}
        selected={isActive}
        className={styles.itemButton}
        sx={{
          px: expanded ? 1.5 : 1,
          py: 1.25,
          minHeight: 56,
          justifyContent: expanded ? "space-between" : "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: expanded ? 1.25 : 0,
            flex: expanded ? 1 : "unset",
            justifyContent: expanded ? "flex-start" : "center",
          }}
        >
          <ListItemIcon
            className={styles.itemIcon}
            sx={{
              minWidth: 0,
              mr: expanded ? 1.25 : 0,
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {item.icon}
          </ListItemIcon>

          {expanded && (
            <ListItemText
              primary={item.label}
              sx={{
                m: 0,
                "& .MuiListItemText-primary": {
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.2,
                },
              }}
            />
          )}
        </Box>

        {expanded ? <Box sx={{ width: 0 }} /> : null}
      </ListItemButton>
    );

    return expanded ? (
      btn
    ) : (
      <Tooltip key={item.href} title={item.label} placement="right">
        {btn}
      </Tooltip>
    );
  };

  const content = (
    <Box
      className={styles.container}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        className={styles.header}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-end" : "center",
          px: expanded ? 1 : 0,
          py: 1,
          minHeight: 64,
        }}
      >
        {variant === "permanent" && (
          <Tooltip
            title={expanded ? "Recolher menu" : "Expandir menu"}
            placement="right"
          >
            <IconButton
              onClick={onToggleDesktop}
              className={styles.toggleBtn}
              sx={{
                width: 44,
                height: 44,
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: ICON_SIZE }} />
            </IconButton>
          </Tooltip>
        )}
        {variant === "temporary" && (
          <IconButton
            onClick={onCloseMobile}
            className={styles.toggleBtn}
            sx={{
              width: 44,
              height: 44,
            }}
          >
            <CloseIcon sx={{ fontSize: ICON_SIZE }} />
          </IconButton>
        )}
      </Box>

      <List className={styles.list} sx={{ px: 1 }}>
        {navItems
          .filter((item) => {
            if (!item.roles) return true;
            if (!role) return false;
            return item.roles.includes(role);
          })
          .map(renderItemButton)}
      </List>

      <Box className={styles.footer} sx={{ pb: 1 }}>
        <List disablePadding sx={{ px: 1 }}>
          {bottomItems.map(renderItemButton)}
        </List>
      </Box>
    </Box>
  );

  // MOBILE
  if (variant === "temporary") {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {content}
      </Drawer>
    );
  }

  // DESKTOP
  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: "none", md: "block" },
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          overflowX: "hidden",
          transition: "width 220ms ease",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
