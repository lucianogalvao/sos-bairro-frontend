import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { Overview } from "../types";

type Props = {
  overview?: Overview;
  isLoading: boolean;
};

export default function OccurencesCards({ overview, isLoading }: Props) {
  if (isLoading || !overview) {
    return (
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            color="text.secondary"
            height={120}
            sx={{ borderRadius: 0.5 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
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
      p={2.5}
      borderRadius={0.5}
      bgcolor={theme.palette.background.paper}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        color={theme.palette.text.secondary}
      >
        {title}
      </Typography>
      <Typography
        variant="h1"
        color={theme.palette.text.primary}
        fontWeight={700}
      >
        {value ? value : 0}
      </Typography>
    </Box>
  );
}
