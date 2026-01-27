"use client";

import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { dashboardQueries } from "@/features/dashboard/queries";
import LayoutContainer from "../common/LayoutContainer";

import OccurrencesCards from "./components/OccurrencesCards";
import StatusChart from "./components/StatusChart";
import NewOccurrences from "./components/NewOccurrences";

import styles from "./dashboard.module.scss";

export default function DashboardClient() {
  const theme = useTheme();
  const overview = useQuery(dashboardQueries.overview());
  const latest = useQuery(dashboardQueries.latest());

  console.log(latest);
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
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="stretch"
        width="100%"
        minHeight={0}
        sx={{
          gap: 4,
          [theme.breakpoints.down("nb")]: {
            gap: 2.5,
          },
          [theme.breakpoints.down("md")]: {
            maxWidth: "400px",
            margin: "0 auto",
          },
        }}
      >
        <Box
          flex={{ xs: "unset", md: 1 }}
          display="flex"
          flexDirection="column"
          minHeight={0}
          maxWidth={"calc(55vw - 32px)"}
          sx={{
            gap: 4,
            [theme.breakpoints.down("nb")]: {
              gap: 2.5,
            },
            [theme.breakpoints.down("md")]: {
              maxWidth: "100%",
            },
          }}
        >
          <Link href="/nova-ocorrencia" className={styles.newOccurrenceLink}>
            <AddIcon />
            <Typography component="span">Nova Ocorrência</Typography>
          </Link>
          <OccurrencesCards
            isLoading={overview.isLoading}
            overview={overview.data}
          />

          <StatusChart
            occurrences={overview.data}
            isLoading={overview.isLoading}
          />
        </Box>

        <Box
          flex={{ xs: "unset", md: 1 }}
          display="flex"
          flexDirection="column"
          minHeight={0}
          maxWidth={"calc(36vw - 32px)"}
          sx={{
            [theme.breakpoints.down("nb")]: {
              gap: 2.5,
            },
            [theme.breakpoints.down("md")]: {
              maxWidth: "100%",
              minHeight: "unset",
              flex: "unset",
            },
          }}
        >
          <NewOccurrences
            occurrences={latest.data.items}
            isLoading={latest.isLoading}
          />
        </Box>
      </Box>
    </LayoutContainer>
  );
}
