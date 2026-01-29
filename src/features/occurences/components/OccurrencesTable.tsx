"use client";

import {
  Chip,
  IconButton,
  Stack,
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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import normalizeStatusLabel from "@/shared/utils/normalizeStatusLabel";
import statusChipColor from "@/shared/utils/statusChipColor";

import type { Occurrence, Order, SortKey } from "@/features/dashboard/types";

export function OccurrencesTable({
  isMobile,
  isNotebook,
  items,
  order,
  orderBy,
  onRequestSort,
  onOpenDetails,
  selectedId,
  detailsOpen,
  isLoading,
  emptyMessage = "Nenhuma ocorrência encontrada.",

  // ✅ NOVO: delete
  onAskDelete,
  canDelete,
  deleteTooltip,
}: {
  isMobile: boolean;
  isNotebook: boolean;
  items: Occurrence[];
  order: Order;
  orderBy: SortKey;
  onRequestSort: (key: SortKey) => void;
  onOpenDetails: (row: Occurrence) => void;
  selectedId: number | string | null;
  detailsOpen: boolean;
  isLoading: boolean;
  emptyMessage?: string;

  onAskDelete: (row: Occurrence) => void;
  canDelete: (row: Occurrence) => boolean;
  deleteTooltip?: (row: Occurrence) => string;
}) {
  const theme = useTheme();

  const headerBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(2,6,23,0.04)";

  return (
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
              backgroundColor: headerBg,
            }}
          >
            <TableCell sx={{ fontWeight: 800, fontSize: 12, width: "60%" }}>
              <TableSortLabel
                active={orderBy === "description" || orderBy === "category"}
                direction={order}
                onClick={() =>
                  onRequestSort(
                    orderBy === "description" ? "category" : "description",
                  )
                }
              >
                Ocorrência
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 800, fontSize: 12, width: "40%" }}>
              <TableSortLabel
                active={orderBy === "createdAt" || orderBy === "status"}
                direction={order}
                onClick={() =>
                  onRequestSort(
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
              backgroundColor: headerBg,
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
                onClick={() => onRequestSort("description")}
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
                onClick={() => onRequestSort("category")}
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
                onClick={() => onRequestSort("status")}
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
                onClick={() => onRequestSort("createdAt")}
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
                onClick={() => onRequestSort("risk")}
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
                onClick={() => onRequestSort("user")}
              >
                Usuário
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ width: 88 }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row, idx) => {
            const isEven = idx % 2 === 1;
            const isSelected =
              detailsOpen && selectedId != null && selectedId === row.id;

            const bg = isSelected
              ? theme.palette.mode === "dark"
                ? "rgba(37,99,235,0.16)"
                : "rgba(37,99,235,0.10)"
              : isEven
                ? theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(2,6,23,0.03)"
                : "transparent";

            const allowedToDelete = canDelete(row);
            const titleDelete = deleteTooltip
              ? deleteTooltip(row)
              : allowedToDelete
                ? "Excluir ocorrência"
                : "Você não pode excluir esta ocorrência";

            return (
              <TableRow
                key={row.id}
                hover
                onClick={() => onOpenDetails(row)}
                sx={{ cursor: "pointer", backgroundColor: bg }}
              >
                {/* Mobile cols */}
                <TableCell
                  sx={{
                    display: { xs: "table-cell", md: "none" },
                    width: "60%",
                    maxWidth: 520,
                  }}
                >
                  <Stack spacing={0.6}>
                    <Tooltip title={row.description} placement="top" arrow>
                      <Typography
                        sx={{ lineHeight: 1.2, fontWeight: 800, fontSize: 12 }}
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

                {/* Desktop cols */}
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

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Tooltip
                    title={row.category?.title ?? "-"}
                    placement="top"
                    arrow
                  >
                    <Typography noWrap>{row.category?.title ?? "-"}</Typography>
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

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
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
                    <Typography noWrap>{row.resident?.name ?? "-"}</Typography>
                  </Tooltip>
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={0.5}
                  >
                    <Tooltip title="Ver detalhes" placement="top" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(row);
                        }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={titleDelete} placement="top" arrow>
                      {/* span para tooltip funcionar com disabled */}
                      <span>
                        <IconButton
                          size="small"
                          disabled={!allowedToDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAskDelete(row);
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}

          {!isLoading && items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 2 : 7}>
                <Typography color="text.secondary">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
