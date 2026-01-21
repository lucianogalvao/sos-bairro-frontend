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
        variant="h5"
        component="span"
        sx={{ whiteSpace: "nowrap", ml: 2 }}
      >
        {label
          ? "REGISTRADA" === label
            ? "Registradas"
            : "EM ANALISE" === label
              ? "Em Análise"
              : "RESOLVIDA" === label
                ? "Resolvidas"
                : label
          : ""}
      </Typography>

      <Typography
        variant="h5"
        component="span"
        sx={{ whiteSpace: "nowrap", ml: 1 }}
      >
        {value}
      </Typography>
    </Box>
  );
}
