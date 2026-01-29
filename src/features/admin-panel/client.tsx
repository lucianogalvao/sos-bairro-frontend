"use client";

import * as React from "react";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import LayoutContainer from "../common/LayoutContainer";
import { AdminFilters } from "./components/AdminFilters";
import { useAdminPanelState } from "./hooks/useAdminPanelState";
import { Alert } from "@mui/material";
import { useAdminPanelData } from "./hooks/useAdminPanelData";
import { AdminTabs } from "./components/AdminTabs";
import { AdminHeader } from "./components/AdminHeaders";
import { NewCategoryDialog } from "./components/NewCategoryDialog";
import { LoadingBox } from "../common/LoadingBox";
import { UsersSection } from "./components/UsersSection";
import { CategoriesSection } from "./components/CategoriesSection";

export default function AdminPanelClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const state = useAdminPanelState();
  const data = useAdminPanelData({
    filterText: state.filterText,
    roleFilter: state.roleFilter,
  });

  const showLoading =
    (state.activeTab === "users" && data.isLoadingUsers) ||
    (state.activeTab === "categories" && data.isLoadingCategories);

  return (
    <LayoutContainer>
      <Box
        p={{ xs: 2, sm: 2.25, md: 2.25, lg: 2 }}
        borderRadius={0.5}
        bgcolor={theme.palette.background.paper}
        minHeight="80vh"
      >
        <Stack spacing={2.2}>
          <AdminTabs
            activeTab={state.activeTab}
            onChange={(tab) => {
              state.setActiveTab(tab);
              if (tab === "categories") {
                state.setCategoriesDeleteError(null);
                state.setPendingDeleteId(null);
              }
            }}
          />

          <AdminHeader
            title={state.activeTab === "users" ? "Usuários" : "Categorias"}
            activeTab={state.activeTab}
            onNewCategory={() => state.setNewCategoryOpen(true)}
          />

          <AdminFilters
            activeTab={state.activeTab}
            filterText={state.filterText}
            onFilterTextChange={state.setFilterText}
            roleFilter={state.roleFilter}
            onRoleFilterChange={state.setRoleFilter}
          />

          {state.activeTab === "categories" && state.categoriesDeleteError ? (
            <Alert
              severity="warning"
              onClose={() => state.setCategoriesDeleteError(null)}
            >
              {state.categoriesDeleteError}
            </Alert>
          ) : null}

          {showLoading ? (
            <LoadingBox />
          ) : state.activeTab === "users" ? (
            <UsersSection
              isMobile={isMobile}
              rows={data.userRows}
              onToggleRole={data.onToggleUserRole}
            />
          ) : (
            <CategoriesSection
              isMobile={isMobile}
              rows={data.categoryRows}
              pendingDeleteId={state.pendingDeleteId}
              setPendingDeleteId={state.setPendingDeleteId}
              setCategoriesDeleteError={state.setCategoriesDeleteError}
              isDeleting={data.isDeletingCategory}
              onDeleteCategory={data.onDeleteCategory}
            />
          )}
        </Stack>

        <NewCategoryDialog
          open={state.newCategoryOpen}
          onClose={() => state.setNewCategoryOpen(false)}
          title={state.newCategoryTitle}
          setTitle={state.setNewCategoryTitle}
          risk={state.newCategoryRisk}
          setRisk={state.setNewCategoryRisk}
          error={state.newCategoryError}
          setError={state.setNewCategoryError}
          onSubmit={data.onCreateCategory}
          isPending={data.isCreatingCategory}
        />
      </Box>
    </LayoutContainer>
  );
}
