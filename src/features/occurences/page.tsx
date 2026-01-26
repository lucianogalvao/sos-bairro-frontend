"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useQuery } from "@tanstack/react-query";

import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import statusChipColor from "@/shared/utils/statusChipColor";
import LayoutContainer from "../common/LayoutContainer";
import { categoriesQueries, occurrencesQueries } from "./queries";
import {
  Occurrence,
  OccurrenceCategory,
  OccurrenceStatus,
  Order,
  SortKey,
} from "../dashboard/types";
import normalizeStatusLabel from "@/shared/utils/normalizeStatusLabel";
import DialogDetails from "./components/DialogDetails";

function getSortValue(o: Occurrence, key: SortKey) {
  switch (key) {
    case "description":
      return (o.description ?? "").toLowerCase();
    case "category":
      return (o.category?.title ?? "").toLowerCase();
    case "status":
      return (o.status ?? "").toLowerCase();
    case "createdAt":
      return new Date(o.createdAt ?? 0).getTime();
    case "risk":
      return (o.category?.riskLevel ?? "").toLowerCase();
    case "user":
      return (o.resident?.name ?? "").toLowerCase();
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

export default function OccurrencesClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isNotebook = useMediaQuery("(max-width:1440px)");

  // filtros
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | OccurrenceStatus>("");
  const [categoryId, setCategoryId] = React.useState<number | "">("");

  // paginação
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // ordenação (client-side, por enquanto)
  const [orderBy, setOrderBy] = React.useState<SortKey>("createdAt");
  const [order, setOrder] = React.useState<Order>("desc");

  // detalhe selecionado
  const [selected, setSelected] = React.useState<Occurrence | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  function openDetails(row: Occurrence) {
    setSelected(row);
    setDetailsOpen(true);
  }

  function closeDetails() {
    setDetailsOpen(false);
    setSelected(null);
  }
  const occurrences = useQuery(occurrencesQueries.occurrences());
  const categories = useQuery(categoriesQueries.categories());

  const isLoading = occurrences.isLoading || categories.isLoading;

  const items = React.useMemo(() => {
    const safe = Array.isArray(occurrences.data?.items)
      ? occurrences.data!.items
      : [];

    const s = search.trim().toLowerCase();

    const filtered = safe.filter((o: Occurrence) => {
      // search by description
      if (s) {
        const desc = (o.description ?? "").toLowerCase();
        if (!desc.includes(s)) return false;
      }

      // status filter
      if (status) {
        const st = String(o.status ?? "");
        if (st !== String(status)) return false;
      }

      // category filter
      if (categoryId !== "") {
        if (Number(o.categoryId) !== Number(categoryId)) return false;
      }

      return true;
    });

    // sort (client-side)
    const sorted = [...filtered].sort(getComparator(order, orderBy));

    // paginate (client-side)
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [
    occurrences.data,
    order,
    orderBy,
    search,
    status,
    categoryId,
    page,
    pageSize,
  ]);

  const filteredTotal = React.useMemo(() => {
    const safe = Array.isArray(occurrences.data?.items)
      ? occurrences.data!.items
      : [];

    const s = search.trim().toLowerCase();

    return safe.filter((o: Occurrence) => {
      if (s) {
        const desc = (o.description ?? "").toLowerCase();
        if (!desc.includes(s)) return false;
      }

      if (status) {
        const st = String(o.status ?? "");
        if (st !== String(status)) return false;
      }

      if (categoryId !== "") {
        if (Number(o.categoryId) !== Number(categoryId)) return false;
      }

      return true;
    }).length;
  }, [occurrences.data, search, status, categoryId]);

  const localTotalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  function handleRequestSort(key: SortKey) {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setCategoryId("");
    setPage(1);
  }

  React.useEffect(() => {
    setPage(1);
  }, [search, status, categoryId]);

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
        sx={{
          width: "100%",
          display: "flex",
          gap: { xs: 2, md: 3 },
          alignItems: "stretch",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Paper
          sx={{
            flex: 1,
            p: { xs: 1.5, md: isNotebook ? 2.25 : 3 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,

            display: "flex",
            flexDirection: "column",
            minHeight: { xs: "calc(100svh - 140px)", md: "auto" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              p: { xs: 1, md: isNotebook ? 1 : 1.25 },
              mb: { xs: 1.5, md: 2 },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{
                width: "100%",
                flexWrap: { sm: "wrap", md: isNotebook ? "wrap" : "nowrap" },
                rowGap: 1.25,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <FilterListRoundedIcon fontSize="small" />
                <Typography fontWeight={700}>Filtrar</Typography>
              </Stack>

              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                placeholder="Descrição..."
                sx={{
                  width: { xs: "100%", sm: 260 },
                  "& .MuiInputBase-root": { height: 36 },
                }}
              />

              <FormControl size="small" sx={{ width: { xs: "100%", sm: 180 } }}>
                <Select
                  value={status}
                  onChange={(e) =>
                    setStatus(String(e.target.value) as OccurrenceStatus)
                  }
                  displayEmpty
                  sx={{ height: 36 }}
                >
                  <MenuItem value="">Status</MenuItem>
                  <MenuItem value="REGISTRADA">Registrada</MenuItem>
                  <MenuItem value="EM_ANALISE">Em análise</MenuItem>
                  <MenuItem value="RESOLVIDA">Resolvida</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
                <Select
                  value={categoryId}
                  onChange={(e) => {
                    const value = e.target.value as unknown as string;
                    setCategoryId(value === "" ? "" : Number(value));
                  }}
                  displayEmpty
                  sx={{ height: 36 }}
                >
                  <MenuItem value="">Categoria</MenuItem>

                  {categories.isLoading && (
                    <MenuItem value="" disabled>
                      Carregando categorias...
                    </MenuItem>
                  )}

                  {categories.isError && (
                    <MenuItem value="" disabled>
                      Erro ao carregar categorias
                    </MenuItem>
                  )}

                  {!categories.isLoading &&
                    !categories.isError &&
                    (categories.data ?? []).length === 0 && (
                      <MenuItem value="" disabled>
                        Nenhuma categoria encontrada
                      </MenuItem>
                    )}

                  {(categories.data ?? []).map((c: OccurrenceCategory) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {categories.isError && (
                <Typography variant="caption" color="error" sx={{ mt: -0.5 }}>
                  {String(
                    (categories.error as Error)?.message ??
                      "Erro ao buscar categorias",
                  )}
                </Typography>
              )}

              <Button
                size="small"
                onClick={resetFilters}
                sx={{
                  height: 36,
                  alignSelf: { xs: "stretch", sm: "auto" },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                Limpar
              </Button>
            </Stack>

            <Button
              component={Link}
              href="/nova-ocorrencia"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                height: 36,
                whiteSpace: "nowrap",
                mt: { xs: 1, md: 0 },
                alignSelf: { xs: "stretch", md: "auto" },
              }}
            >
              Nova Ocorrência
            </Button>
          </Box>

          <TableContainer
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflowX: "auto",
              overflowY: "auto",
              flex: { xs: 1, md: "unset" },
              minHeight: 0,
              maxHeight: {
                xs: "unset",
                md: isNotebook ? "calc(100vh - 220px)" : "calc(100vh - 240px)",
              },
            }}
          >
            <Table
              size="small"
              aria-label="ocorrências"
              sx={{
                "& .MuiTableCell-root": {
                  py: isMobile ? 0.75 : isNotebook ? 0.9 : 1.1,
                  fontSize: isMobile ? 12 : isNotebook ? 13 : 14,
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    display: { xs: "table-row", md: "none" },
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(2,6,23,0.04)",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: 800, fontSize: 12, width: "60%" }}
                  >
                    <TableSortLabel
                      active={
                        orderBy === "description" || orderBy === "category"
                      }
                      direction={order}
                      onClick={() =>
                        handleRequestSort(
                          orderBy === "description"
                            ? "category"
                            : "description",
                        )
                      }
                    >
                      Ocorrência
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: 800, fontSize: 12, width: "40%" }}
                  >
                    <TableSortLabel
                      active={orderBy === "createdAt" || orderBy === "status"}
                      direction={order}
                      onClick={() =>
                        handleRequestSort(
                          orderBy === "createdAt" ? "status" : "createdAt",
                        )
                      }
                    >
                      Data / Status
                    </TableSortLabel>
                  </TableCell>
                </TableRow>

                <TableRow
                  sx={{
                    display: { xs: "none", md: "table-row" },
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(2,6,23,0.04)",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      width: { md: isNotebook ? "34%" : "28%" },
                      fontSize: isNotebook ? 13 : 14,
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

                  <TableCell
                    sx={{
                      fontWeight: 800,
                      width: { md: isNotebook ? "22%" : "20%" },
                      fontSize: isNotebook ? 13 : 14,
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

                  <TableCell
                    sx={{
                      fontWeight: 800,
                      width: { md: isNotebook ? "16%" : "14%" },
                      whiteSpace: "nowrap",
                      fontSize: isNotebook ? 13 : 14,
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

                  <TableCell
                    sx={{
                      fontWeight: 800,
                      width: { md: isNotebook ? "14%" : "12%" },
                      whiteSpace: "nowrap",
                      fontSize: isNotebook ? 13 : 14,
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
                      fontWeight: 800,
                      width: "10%",
                      fontSize: isNotebook ? 13 : 14,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "risk"}
                      direction={orderBy === "risk" ? order : "asc"}
                      onClick={() => handleRequestSort("risk")}
                    >
                      Risco
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 800,
                      width: { md: isNotebook ? "14%" : "14%" },
                      fontSize: isNotebook ? 13 : 14,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "user"}
                      direction={orderBy === "user" ? order : "asc"}
                      onClick={() => handleRequestSort("user")}
                    >
                      Usuário
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ width: 48 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row, idx) => {
                  const isEven = idx % 2 === 1;
                  const isSelected = detailsOpen && selected?.id === row.id;

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => openDetails(row)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? theme.palette.mode === "dark"
                            ? "rgba(37,99,235,0.16)"
                            : "rgba(37,99,235,0.10)"
                          : isEven
                            ? theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(2,6,23,0.03)"
                            : "transparent",
                      }}
                    >
                      <TableCell
                        sx={{
                          display: { xs: "table-cell", md: "none" },
                          width: "60%",
                          maxWidth: 520,
                        }}
                      >
                        <Stack spacing={0.6}>
                          <Tooltip
                            title={row.description}
                            placement="top"
                            arrow
                          >
                            <Typography
                              sx={{
                                lineHeight: 1.2,
                                fontWeight: 800,
                                fontSize: 12,
                              }}
                            >
                              {row.description}
                            </Typography>
                          </Tooltip>

                          <Tooltip
                            title={row.category?.title ?? "-"}
                            placement="top"
                            arrow
                          >
                            <Typography
                              sx={{
                                lineHeight: 1.2,
                                fontSize: 12,
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {row.category?.title ?? "-"}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "table-cell", md: "none" },
                          width: "40%",
                          whiteSpace: "nowrap",
                          verticalAlign: "top",
                        }}
                      >
                        <Stack spacing={0.8} alignItems="flex-end">
                          <Tooltip title={row.createdAt} placement="top" arrow>
                            <Typography sx={{ fontSize: 12 }}>
                              {formatDatePtBR(row.createdAt)}
                            </Typography>
                          </Tooltip>

                          <Chip
                            size="small"
                            label={normalizeStatusLabel(row.status)}
                            color={statusChipColor(row.status)}
                            variant="filled"
                            sx={{ height: 22, fontSize: 11, fontWeight: 800 }}
                          />
                        </Stack>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          maxWidth: 420,
                        }}
                      >
                        <Tooltip title={row.description} placement="top" arrow>
                          <Typography
                            noWrap
                            sx={{ lineHeight: 1.25, fontWeight: 600 }}
                          >
                            {row.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <Tooltip
                          title={row.category?.title ?? "-"}
                          placement="top"
                          arrow
                        >
                          <Typography noWrap>
                            {row.category?.title ?? "-"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Chip
                          size="small"
                          label={normalizeStatusLabel(row.status)}
                          color={statusChipColor(row.status)}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip title={row.createdAt} placement="top" arrow>
                          <Typography noWrap>
                            {formatDatePtBR(row.createdAt)}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <Typography
                          sx={{
                            color:
                              row.category?.riskLevel === "ALTO"
                                ? theme.palette.error.main
                                : row.category?.riskLevel === "MEDIO"
                                  ? theme.palette.warning.main
                                  : theme.palette.success.main,
                            fontWeight: 700,
                          }}
                        >
                          {(row.category?.riskLevel ?? "-").toString()}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          maxWidth: 180,
                        }}
                      >
                        <Tooltip
                          title={row.resident?.name ?? "-"}
                          placement="top"
                          arrow
                        >
                          <Typography noWrap>
                            {row.resident?.name ?? "-"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <Tooltip title="Ver detalhes" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(row);
                            }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!occurrences.isLoading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 2 : 7}>
                      <Typography color="text.secondary">
                        Nenhuma ocorrência encontrada.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 1.5, md: 2 },
              flexShrink: 0,
            }}
          >
            <Pagination
              page={page}
              count={localTotalPages}
              onChange={(_, next) => setPage(next)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Paper>
        <DialogDetails
          detailsOpen={detailsOpen}
          closeDetails={closeDetails}
          isMobile={isMobile}
          isNotebook={isNotebook}
          selected={selected}
        />
      </Box>
    </LayoutContainer>
  );
}
