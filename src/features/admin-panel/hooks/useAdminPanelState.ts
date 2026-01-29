"use client";

import * as React from "react";
import type { Role } from "@/store/types";
import { RiskLevel } from "@/features/dashboard/types";

export function useAdminPanelState() {
  const [activeTab, setActiveTab] = React.useState<"categories" | "users">(
    "users",
  );

  const [filterText, setFilterText] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<Role | "">("");
  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(
    null,
  );

  const [categoriesDeleteError, setCategoriesDeleteError] = React.useState<
    string | null
  >(null);

  const [newCategoryOpen, setNewCategoryOpen] = React.useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = React.useState("");
  const [newCategoryRisk, setNewCategoryRisk] =
    React.useState<RiskLevel>("MEDIO");
  const [newCategoryError, setNewCategoryError] = React.useState<string | null>(
    null,
  );

  return {
    activeTab,
    setActiveTab,

    filterText,
    setFilterText,

    roleFilter,
    setRoleFilter,

    pendingDeleteId,
    setPendingDeleteId,

    categoriesDeleteError,
    setCategoriesDeleteError,

    newCategoryOpen,
    setNewCategoryOpen,
    newCategoryTitle,
    setNewCategoryTitle,
    newCategoryRisk,
    setNewCategoryRisk,
    newCategoryError,
    setNewCategoryError,
  };
}
