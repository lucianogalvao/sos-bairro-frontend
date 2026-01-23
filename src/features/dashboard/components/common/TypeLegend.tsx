"use client";

import { Box, useTheme } from "@mui/material";
import { PieItem } from "../../types";
import TypeLegendItem from "./TypeLegendItem";

type Props = {
  items: PieItem[];
};

export default function TypeLegend({ items }: Props) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      gap={4}
      alignItems="center"
      justifyContent="center"
      mt={4}
      sx={{
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          gap: 2,
        },
      }}
    >
      {items.map((item) => (
        <TypeLegendItem
          key={item.label}
          color={item.color}
          label={item.label}
          value={item.value}
        />
      ))}
    </Box>
  );
}
