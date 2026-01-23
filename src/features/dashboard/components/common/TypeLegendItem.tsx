"use client";

import { Box, Typography } from "@mui/material";
import { Dot } from "../common/Dot";

type Props = {
  color: string;
  label: string;
  value: number;
};

export default function TypeLegendItem({ color, label, value }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Dot color={color} />

      <Typography
        component="span"
        sx={{
          whiteSpace: "nowrap",
          ml: 2,
          fontWeight: 600,
          fontSize: {
            xs: "0.75rem",
            sm: "0.8rem",
            notebook: "0.85rem",
            lg: "0.95rem",
          },
        }}
      >
        {label
          ? label === "REGISTRADA"
            ? "Registradas"
            : label === "EM ANALISE"
              ? "Em Análise"
              : label === "RESOLVIDA"
                ? "Resolvidas"
                : label
          : ""}
      </Typography>

      <Typography
        component="span"
        sx={{
          whiteSpace: "nowrap",
          ml: 1,
          fontWeight: 700,
          fontSize: {
            xs: "0.85rem",
            sm: "0.95rem",
            notebook: "1rem",
            lg: "1.1rem",
          },
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
