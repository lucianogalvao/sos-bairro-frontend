"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { occurrencesQueries } from "@/features/occurences/queries"; // ajuste o path se for outro
import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import statusChipColor from "@/shared/utils/statusChipColor";
import { OccurrenceStatus } from "@/features/dashboard/types";

// Ajuste se o seu type estiver em outro lugar:
type Occurrence = {
  id: number;
  description: string;
  status: string;
  createdAt: string;
  category?: { title?: string } | null;
};

type SortKey = "description" | "category" | "createdAt" | "status";
type Order = "asc" | "desc";

export default function LatestOccurrencesTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query = useQuery(occurrencesQueries.occurrences());

  const items = (query.data?.items ?? []) as Occurrence[];

  const [orderBy, setOrderBy] = React.useState<SortKey>("createdAt");
  const [order, setOrder] = React.useState<Order>("desc");

  const rows = React.useMemo(() => {
    const safe = Array.isArray(items) ? items : [];
    const sorted = [...safe].sort(getComparator(order, orderBy));
    return sorted.slice(0, 10);
  }, [items, order, orderBy]);

  function handleRequestSort(key: SortKey) {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  }

  if (query.isLoading) {
    return (
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        Carregando...
      </Typography>
    );
  }

  if (!query.isLoading && rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        Nenhuma ocorrência encontrada.
      </Typography>
    );
  }

  return (
    <TableContainer
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Table size="small" stickyHeader aria-label="últimas ocorrências">
        <TableHead>
          <TableRow>
            {isMobile ? (
              <>
                <TableCell sx={{ fontWeight: 900 }}>
                  <TableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    Ocorrência
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 900, whiteSpace: "nowrap" }}>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Info
                  </TableSortLabel>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell sx={{ fontWeight: 900, width: "45%" }}>
                  <TableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    Descrição
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ fontWeight: 900, width: "25%" }}>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    Categoria
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 900, width: "15%", whiteSpace: "nowrap" }}
                >
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Data
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ fontWeight: 900, width: "15%" }}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, idx) => {
            const zebra =
              idx % 2 === 1
                ? theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(2,6,23,0.04)"
                : "transparent";

            if (isMobile) {
              return (
                <TableRow key={row.id} hover sx={{ background: zebra }}>
                  <TableCell sx={{ width: "60%", maxWidth: 0 }}>
                    <Tooltip title={row.description} arrow>
                      <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
                        {row.description}
                      </Typography>
                    </Tooltip>
                    <Typography
                      sx={{ fontSize: 12 }}
                      color="text.secondary"
                      noWrap
                    >
                      {row.category?.title ?? "-"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: "40%", whiteSpace: "nowrap" }}>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                      {formatDatePtBR(row.createdAt)}
                    </Typography>

                    <Box mt={0.5}>
                      <Chip
                        size="small"
                        label={row.status.replaceAll("_", " ")}
                        color={statusChipColor(row.status as OccurrenceStatus)}
                        variant="filled"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={row.id} hover sx={{ background: zebra }}>
                <TableCell sx={{ maxWidth: 0 }}>
                  <Tooltip title={row.description} arrow>
                    <Typography noWrap sx={{ fontSize: 13 }}>
                      {row.description}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={row.category?.title ?? "-"} arrow>
                    <Typography noWrap sx={{ fontSize: 13 }}>
                      {row.category?.title ?? "-"}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography sx={{ fontSize: 13 }}>
                    {formatDatePtBR(row.createdAt)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={row.status.replaceAll("_", " ")}
                    color={statusChipColor(row.status as OccurrenceStatus)}
                    variant="filled"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function getSortValue(o: Occurrence, key: SortKey) {
  switch (key) {
    case "description":
      return (o.description ?? "").toLowerCase();
    case "category":
      return (o.category?.title ?? "").toLowerCase();
    case "createdAt":
      return new Date(o.createdAt ?? 0).getTime();
    case "status":
      return (o.status ?? "").toLowerCase();
    default:
      return "";
  }
}

function getComparator(order: Order, orderBy: SortKey) {
  return (a: Occurrence, b: Occurrence) => {
    const aVal = getSortValue(a, orderBy);
    const bVal = getSortValue(b, orderBy);
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  };
}
