"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import getNextRole from "@/shared/utils/getNextRole";
import type { Role } from "@/store/types";
import type {
  Occurrence,
  OccurrenceCategory,
  RiskLevel,
} from "@/features/dashboard/types";

import type { User } from "../types";
import {
  useDeleteCategory,
  useNewCategory,
  usersQuery,
  useUpdateUserRole,
} from "../queries";
import {
  categoriesQueries,
  occurrencesQueries,
} from "@/features/occurences/queries";

export function useAdminPanelData({
  filterText,
  roleFilter,
}: {
  filterText: string;
  roleFilter: Role | "";
}) {
  const users = useQuery(usersQuery.users());
  const categoriesQuery = useQuery(categoriesQueries.categories());
  const occurrencesQuery = useQuery(occurrencesQueries.occurrences());

  const deleteCategoryMutation = useDeleteCategory();
  const updateRoleMutation = useUpdateUserRole();
  const createCategoryMutation = useNewCategory();

  const categories = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data?.items;

  const categoriesSafe = React.useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  const occurrencesList = React.useMemo<Occurrence[]>(() => {
    const data = occurrencesQuery.data as
      | Occurrence[]
      | { items: Occurrence[] }
      | undefined;

    const list = Array.isArray(data) ? data : data?.items;
    return Array.isArray(list) ? (list as Occurrence[]) : [];
  }, [occurrencesQuery.data]);

  const occurrencesCountByCategory = React.useMemo(() => {
    const map = new Map<number, number>();

    for (const o of occurrencesList) {
      const categoryId = o?.category?.id;
      if (typeof categoryId !== "number") continue;

      map.set(categoryId, (map.get(categoryId) ?? 0) + 1);
    }

    return map;
  }, [occurrencesList]);

  const q = filterText.trim().toLowerCase();

  const userRows = React.useMemo<User[]>(() => {
    const list = Array.isArray(users.data) ? (users.data as User[]) : [];

    return list
      .filter((u) => u.role !== "ADMIN")
      .filter((u) => {
        const matchesText =
          !q ||
          String(u.name ?? "")
            .toLowerCase()
            .includes(q) ||
          String(u.email ?? "")
            .toLowerCase()
            .includes(q);

        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesText && matchesRole;
      });
  }, [users.data, q, roleFilter]);

  const categoryRows = React.useMemo(() => {
    return categoriesSafe
      .map((c: OccurrenceCategory) => ({
        ...c,
        occurrencesCount: occurrencesCountByCategory.get(c.id) ?? 0,
      }))
      .filter((c: OccurrenceCategory & { occurrencesCount: number }) => {
        const title = String(c?.title ?? "").toLowerCase();
        return !q || title.includes(q);
      });
  }, [categoriesSafe, q, occurrencesCountByCategory]);

  async function onToggleUserRole(u: User) {
    const nextRole = getNextRole(u.role);
    if (!nextRole) return;

    await updateRoleMutation.mutateAsync({
      id: u.id,
      nextRole,
    });
  }

  async function onDeleteCategory(categoryId: number) {
    await deleteCategoryMutation.mutateAsync(categoryId);
  }

  async function onCreateCategory(payload: {
    title: string;
    riskLevel: RiskLevel;
  }) {
    await createCategoryMutation.mutateAsync(payload);
  }

  return {
    userRows,
    categoryRows,

    isLoadingUsers: users.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,

    onToggleUserRole,
    onDeleteCategory,
    onCreateCategory,

    isDeletingCategory: deleteCategoryMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending,
  };
}
