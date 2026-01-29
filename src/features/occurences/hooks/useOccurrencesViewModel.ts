"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueries, occurrencesQueries } from "../queries";
import type {
  Occurrence,
  OccurrenceStatus,
  Order,
  SortKey,
} from "@/features/dashboard/types";

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

export function useOccurrencesViewModel({
  search,
  status,
  categoryId,
  page,
  pageSize,
  order,
  orderBy,
}: {
  search: string;
  status: "" | OccurrenceStatus;
  categoryId: number | "";
  page: number;
  pageSize: number;
  order: Order;
  orderBy: SortKey;
}) {
  const occurrences = useQuery(occurrencesQueries.occurrences());
  const categories = useQuery(categoriesQueries.categories());

  const isLoading = occurrences.isLoading || categories.isLoading;

  const all = React.useMemo<Occurrence[]>(() => {
    const safe = Array.isArray(occurrences.data?.items)
      ? occurrences.data!.items
      : [];
    return safe as Occurrence[];
  }, [occurrences.data]);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return all.filter((o) => {
      if (normalizedSearch) {
        const desc = (o.description ?? "").toLowerCase();
        if (!desc.includes(normalizedSearch)) return false;
      }

      if (status) {
        const st = String(o.status ?? "");
        if (st !== String(status)) return false;
      }

      if (categoryId !== "") {
        if (Number(o.categoryId) !== Number(categoryId)) return false;
      }

      return true;
    });
  }, [all, normalizedSearch, status, categoryId]);

  const filteredTotal = filtered.length;

  const items = React.useMemo(() => {
    const sorted = [...filtered].sort(getComparator(order, orderBy));
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [filtered, order, orderBy, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  return {
    occurrences,
    categories,
    isLoading,
    items,
    filteredTotal,
    totalPages,
  };
}
