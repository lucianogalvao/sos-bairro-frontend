import { styled } from "@mui/material";

export const Dot = styled("span")<{ color: string }>(({ color }) => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
}));
