import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { Overview } from "../types";

type Props = {
  overview?: Overview;
  isLoading: boolean;
};

export default function OccurrencesCards({ overview, isLoading }: Props) {
  if (isLoading || !overview) {
    return (
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
          nb: "repeat(4, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={{ xs: 1.5, sm: 2 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            color="text.secondary"
            height={96}
            sx={{
              borderRadius: 0.5,
              height: { xs: 88, sm: 92, md: 96, nb: 88, lg: 96 },
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
        nb: "repeat(4, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={{ xs: 1.5, sm: 2 }}
    >
      <Card title="Ocorrências Totais" value={overview.total} />
      <Card title="Registradas" value={overview.byStatus.REGISTRADA} />
      <Card title="Em Análise" value={overview.byStatus.EM_ANALISE} />
      <Card title="Resolvidas" value={overview.byStatus.RESOLVIDA} />
    </Box>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  const theme = useTheme();
  return (
    <Box
      p={{ xs: 2, sm: 2.25, md: 2.25, nb: 1.75, lg: 2 }}
      borderRadius={0.5}
      bgcolor={theme.palette.background.paper}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      gap={{ xs: 0.75, sm: 1, nb: 0.75 }}
      minHeight={{ xs: 88, sm: 96, md: 104, nb: 92, lg: 104 }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color={theme.palette.text.secondary}
        sx={{
          letterSpacing: 0.2,
          lineHeight: 1.2,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontSize: { xs: 13, sm: 13, md: 14, nb: 12.5, lg: 14 },
        }}
        title={title}
      >
        {title}
      </Typography>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 28, sm: 32, md: 36, nb: 30, lg: 38 },
          lineHeight: 1,
        }}
        color={theme.palette.text.primary}
        fontWeight={800}
      >
        {typeof value === "number" ? value : 0}
      </Typography>
    </Box>
  );
}
