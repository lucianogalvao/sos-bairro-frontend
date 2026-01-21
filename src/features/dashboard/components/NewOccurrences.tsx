"use client";

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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import TitleSlash from "./common/TitleSlash";
import { Occurrence, Order, SortKey } from "../types";
import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import statusChipColor from "@/shared/utils/statusChipColor";

type Props = {
  occurrences: Occurrence[];
  isLoading: boolean;
};

export default function NewOccurrences({ occurrences, isLoading }: Props) {
  const theme = useTheme();
  const [orderBy, setOrderBy] = React.useState<SortKey>("createdAt");
  const [order, setOrder] = React.useState<Order>("desc");
  const limit = 10;

  const rows = React.useMemo(() => {
    const safe = Array.isArray(occurrences) ? occurrences : [];
    const sorted = [...safe].sort(getComparator(order, orderBy));
    return sorted.slice(0, limit);
  }, [occurrences, limit, order, orderBy]);

  function handleRequestSort(key: SortKey) {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  }
  return (
    <Box
      padding={3.5}
      borderRadius={0.5}
      width={"100%"}
      height="100%"
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      <TitleSlash title="Novas Ocorrências" />
      <TableContainer sx={{ mt: 2, height: "100%" }}>
        <Table
          size="small"
          aria-label="novas ocorrências"
          sx={{ tableLayout: "fixed", width: "100%" }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: "30%" }}>
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleRequestSort("description")}
                >
                  Descrição
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, width: "30%" }}>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={() => handleRequestSort("category")}
                >
                  Categoria
                </TableSortLabel>
              </TableCell>

              <TableCell
                sx={{ fontWeight: 700, width: "15%", whiteSpace: "nowrap" }}
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Data
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, width: "15%" }}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell
                  sx={{
                    width: "30%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Tooltip title={row.description} placement="top" arrow>
                    <Typography noWrap>{row.description}</Typography>
                  </Tooltip>
                </TableCell>

                <TableCell
                  sx={{
                    width: "30%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Tooltip
                    title={row.category?.title ?? "-"}
                    placement="top"
                    arrow
                  >
                    <Typography noWrap>
                      {row.category?.title ? row.category.title : "-"}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell sx={{ width: "15%", whiteSpace: "nowrap" }}>
                  {formatDatePtBR(row.createdAt)}
                </TableCell>

                <TableCell sx={{ width: "15%" }}>
                  <Tooltip
                    title={row.status.replaceAll("_", " ")}
                    placement="top"
                    arrow
                  >
                    <Chip
                      size="small"
                      label={row.status.replaceAll("_", " ")}
                      color={statusChipColor(row.status)}
                      variant="filled"
                      sx={{
                        maxWidth: "100%",
                        ".MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary">
                    Nenhuma ocorrência encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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
