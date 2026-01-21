import { Box, CircularProgress, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo } from "react";
import { Overview } from "../types";
import { mapStatusToChartData } from "@/shared/utils/mapStatusToChartData";
import TypeLegend from "./common/TypeLegend";
import TitleSlash from "./common/TitleSlash";

type Props = {
  occurrences: Overview;
  isLoading: boolean;
};

export default function StatusChart({ occurrences, isLoading }: Props) {
  const theme = useTheme();
  const settings = useMemo(
    () => ({
      margin: { right: 5 },
      width: 200,
      height: 200,
      hideLegend: true,
    }),
    [],
  );

  const chartData = mapStatusToChartData(occurrences.byStatus);
  const mh = 380;

  return (
    <Box
      padding={3.5}
      borderRadius={0.5}
      minHeight={mh}
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      {(isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={mh - 28}
        >
          <CircularProgress />
        </Box>
      )) || (
        <>
          <TitleSlash title="Ocorrências por Status" />
          {(chartData.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={mh - 28}
            >
              Nenhum dado disponível
            </Box>
          )) || (
            <>
              <PieChart
                series={[
                  {
                    data: chartData,
                  },
                ]}
                sx={{
                  mt: 2,
                }}
                slotProps={{
                  tooltip: {
                    sx: {
                      display: "none",
                    },
                  },
                  pieArc: {
                    style: {
                      stroke: theme.palette.background.paper,
                      strokeWidth: 10,
                    },
                  },
                }}
                {...settings}
              />
              <TypeLegend items={chartData} />
            </>
          )}
        </>
      )}
    </Box>
  );
}
