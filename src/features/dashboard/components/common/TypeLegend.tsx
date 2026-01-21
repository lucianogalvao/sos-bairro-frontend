"use client";

import { Box } from "@mui/material";
import { PieItem } from "../../types";
import TypeLegendItem from "./TypeLegendItem";

type Props = {
  items: PieItem[];
};

export default function TypeLegend({ items }: Props) {
  return (
    <Box
      display="flex"
      gap={4}
      alignItems="center"
      justifyContent="center"
      mt={4}
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
