"use client";

import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { dashboardQueries } from "@/features/dashboard/queries";
import LayoutContainer from "../common/LayoutContainer";

import OccurencesCards from "./components/OccurencesCards";
import StatusChart from "./components/StatusChart";
import NewOccurrences from "./components/NewOccurrences";

import styles from "./dashboard.module.scss";

export default function DashboardClient() {
  const overview = useQuery(dashboardQueries.overview());
  const latest = useQuery(dashboardQueries.latest());

  const isLoading = overview.isLoading || latest.isLoading;

  if (isLoading)
    return (
      <LayoutContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress size={100} />
        </Box>
      </LayoutContainer>
    );

  return (
    <LayoutContainer>
      <Box
        display="flex"
        gap={4}
        alignItems="stretch"
        width="100%"
        minHeight={0}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap={4}
          minHeight={0}
          maxWidth={"calc(55vw - 32px)"}
        >
          <OccurencesCards
            isLoading={overview.isLoading}
            overview={overview.data}
          />

          <StatusChart
            occurrences={overview.data}
            isLoading={overview.isLoading}
          />

          <Link href="/nova-ocorrencia" className={styles.newOccurrenceLink}>
            <AddIcon />
            <Typography variant="h6" fontWeight={700} component="span">
              Nova Ocorrência
            </Typography>
          </Link>
        </Box>

        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          minHeight={0}
          maxWidth={"calc(36vw - 32px)"}
        >
          <Box flex={1} minHeight={0} display="flex" flexDirection="column">
            <NewOccurrences
              occurrences={latest.data.items}
              isLoading={latest.isLoading}
            />
          </Box>
        </Box>
      </Box>
    </LayoutContainer>
  );
}
