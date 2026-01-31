"use client";

import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { getInitials } from "@/shared/utils/getInitials";

export function ProfileHeader({
  name,
  email,
  role,
  avatarSrc,
  isEditing,
  onEdit,
}: {
  name: string;
  email: string;
  role: string;
  avatarSrc?: string;
  isEditing: boolean;
  onEdit: () => void;
}) {
  const theme = useTheme();

  const surface =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(2,6,23,0.03)";

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Box display="flex" gap={1.5} alignItems="center">
      <Avatar
        src={avatarSrc}
        sx={{
          width: 56,
          height: 56,
          fontWeight: 900,
          bgcolor: surface,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {getInitials(name)}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={900} fontSize={18} noWrap>
          {name || "Meu perfil"}
        </Typography>
        <Typography color="text.secondary" fontSize={13} noWrap>
          {email || "—"}
        </Typography>
        <Typography color="text.secondary" fontSize={10} noWrap>
          {capitalizeFirstLetter(role) || "—"}
        </Typography>
      </Box>

      {!isEditing ? (
        <Button
          variant="outlined"
          onClick={onEdit}
          sx={{ fontWeight: 900, textTransform: "none" }}
        >
          Editar
        </Button>
      ) : null}
    </Box>
  );
}
