import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
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
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isNotebook = useMediaQuery(theme.breakpoints.down("nb"));

  const settings = useMemo(() => {
    const size = isSmDown ? 120 : isMdDown ? 135 : isNotebook ? 145 : 180;
    return {
      margin: { right: 5 },
      width: size,
      height: size,
      hideLegend: true,
    };
  }, [isSmDown, isMdDown, isNotebook]);

  const chartData = mapStatusToChartData(occurrences.byStatus);
  const mh = isSmDown ? 210 : isMdDown ? 230 : isNotebook ? 250 : 280;

  return (
    <Box
      padding={3.5}
      borderRadius={0.5}
      minHeight={mh}
      sx={{
        background: theme.palette.background.paper,
        padding: 3.5,
        [theme.breakpoints.down("nb")]: {
          padding: 2.5,
        },
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
                      strokeWidth: 6,
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
