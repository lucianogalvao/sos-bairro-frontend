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
  useMediaQuery,
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
  const isNotebook = useMediaQuery("(max-width:1440px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      borderRadius={0.5}
      width={"100%"}
      height={"100%"}
      sx={{
        background: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 3, md: 3.5 },
      }}
    >
      <TitleSlash title="Novas Ocorrências" />
      <TableContainer
        sx={{
          mt: { xs: 1.5, md: 2 },
          flex: 1,
          minHeight: 0,
          overflowX: "auto",
          [theme.breakpoints.down("md")]: {
            maxHeight: "100%",
            minHeight: "unset",
            flex: "unset",
          },
        }}
      >
        <Table
          size="small"
          aria-label="novas ocorrências"
          sx={{
            tableLayout: "fixed",
            width: "100%",
            minWidth: isMobile ? 520 : isNotebook ? 600 : 640,
            [theme.breakpoints.down("md")]: {
              minWidth: "100%",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  width: isMobile ? "50%" : "30%",
                  fontSize: { xs: 12, sm: 13, md: 14 },
                }}
              >
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleRequestSort("description")}
                >
                  Descrição
                </TableSortLabel>
              </TableCell>

              {!isMobile && (
                <TableCell
                  sx={{
                    fontWeight: 700,
                    width: "30%",
                    fontSize: { xs: 12, sm: 13, md: 14 },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    Categoria
                  </TableSortLabel>
                </TableCell>
              )}

              <TableCell
                sx={{
                  fontWeight: 700,
                  width: isMobile ? "20%" : "15%",
                  whiteSpace: "nowrap",
                  fontSize: { xs: 12, sm: 13, md: 14 },
                }}
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Data
                </TableSortLabel>
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  width: isMobile ? "30%" : "15%",
                  fontSize: { xs: 12, sm: 13, md: 14 },
                }}
              >
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
                    width: isMobile ? "60%" : "30%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: { xs: 12, sm: 13, md: 14 },
                    pr: { xs: 1, md: 2 },
                  }}
                >
                  <Tooltip title={row.description} placement="top" arrow>
                    <Typography noWrap fontSize="inherit">
                      {row.description}
                    </Typography>
                  </Tooltip>
                </TableCell>

                {!isMobile && (
                  <TableCell
                    sx={{
                      width: "30%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: { xs: 12, sm: 13, md: 14 },
                    }}
                  >
                    <Tooltip
                      title={row.category?.title ?? "-"}
                      placement="top"
                      arrow
                    >
                      <Typography noWrap fontSize="inherit">
                        {row.category?.title ? row.category.title : "-"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}

                <TableCell
                  sx={{
                    width: isMobile ? "20%" : "15%",
                    whiteSpace: "nowrap",
                    fontSize: { xs: 12, sm: 13, md: 14 },
                  }}
                >
                  {formatDatePtBR(row.createdAt)}
                </TableCell>

                <TableCell
                  sx={{
                    width: isMobile ? "20%" : "15%",
                    fontSize: { xs: 12, sm: 13, md: 14 },
                  }}
                >
                  <Tooltip
                    title={row.status.replaceAll("_", " ")}
                    placement="top"
                    arrow
                  >
                    <Chip
                      size={isNotebook ? "small" : "medium"}
                      label={row.status.replaceAll("_", " ")}
                      color={statusChipColor(row.status)}
                      variant="filled"
                      sx={{
                        maxWidth: "100%",
                        height: isNotebook ? 24 : 28,
                        ".MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: { xs: 11, sm: 12, md: 13 },
                          px: 1,
                        },
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={isMobile ? 3 : 4}>
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
