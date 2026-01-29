"use client";

import * as React from "react";
import type {
  Occurrence,
  OccurrenceStatus,
  Order,
  SortKey,
} from "@/features/dashboard/types";

export function useOccurrencesState() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | OccurrenceStatus>("");
  const [categoryId, setCategoryId] = React.useState<number | "">("");

  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const [orderBy, setOrderBy] = React.useState<SortKey>("createdAt");
  const [order, setOrder] = React.useState<Order>("desc");

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

  return {
    search,
    setSearch,
    status,
    setStatus,
    categoryId,
    setCategoryId,

    page,
    setPage,
    pageSize,

    orderBy,
    setOrderBy,
    order,
    setOrder,
    handleRequestSort,

    selected,
    detailsOpen,
    openDetails,
    closeDetails,

    resetFilters,
  };
}
