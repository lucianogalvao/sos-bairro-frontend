"use client";

import * as React from "react";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import LayoutContainer from "../common/LayoutContainer";
import DialogDetails from "./components/DialogDetails";

import { OccurrencesLoading } from "./components/OccurrencesLoading";
import { OccurrencesToolbar } from "./components/OccurrencesToolbar";
import { OccurrencesTable } from "./components/OccurrencesTable";
import { OccurrencesPagination } from "./components/OccurrencesPagination";
import { ConfirmDeleteOccurrenceDialog } from "./components/ConfirmDeleteOccurrenceDialog";

import { useOccurrencesViewModel } from "./hooks/useOccurrencesViewModel";
import { useOccurrencesState } from "./hooks/useOccurrencesState";
import type { Occurrence } from "@/features/dashboard/types";
import { useDeleteOccurrence } from "./queries";
import { useAuthStore } from "@/store/useAuthStore";

export default function OccurrencesClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isNotebook = useMediaQuery("(max-width:1440px)");

  const state = useOccurrencesState();

  const vm = useOccurrencesViewModel({
    search: state.search,
    status: state.status,
    categoryId: state.categoryId,
    page: state.page,
    pageSize: state.pageSize,
    order: state.order,
    orderBy: state.orderBy,
  });

  const me = useAuthStore((s) => s.user);

  const deleteOccurrence = useDeleteOccurrence();

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Occurrence | null>(
    null,
  );

  function askDelete(row: Occurrence) {
    setDeleteTarget(row);
    setDeleteOpen(true);
  }

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  const canDelete = React.useCallback(
    (row: Occurrence) => {
      const myId = me?.id;
      const myRole = me?.role;
      if (!myId) return false;

      const isAdminOrMod = myRole === "ADMIN" || myRole === "MODERADOR";
      const isOwner =
        Number(row?.resident?.id ?? row?.residentId) === Number(myId);

      return isAdminOrMod || isOwner;
    },
    [me],
  );

  const deleteTooltip = React.useCallback(
    (row: Occurrence) => {
      const myId = me?.id;
      const myRole = me?.role;

      if (!myId) return "Carregando usuário...";

      const isAdminOrMod = myRole === "ADMIN" || myRole === "MODERADOR";
      if (isAdminOrMod) return "Excluir ocorrência";

      const isOwner =
        Number(row?.resident?.id ?? row?.residentId) === Number(myId);

      if (!isOwner) return "Você só pode excluir suas próprias ocorrências.";
      return "Excluir ocorrência";
    },
    [me],
  );

  const canEdit = React.useMemo(() => {
    const selected = state.selected;
    const myId = me?.id;
    const myRole = me?.role;

    if (!selected || !myId) return false;

    const isAdminOrMod = myRole === "ADMIN" || myRole === "MODERADOR";
    const isOwner =
      Number(selected?.resident?.id ?? selected?.residentId) === Number(myId);

    const status = String(selected.status ?? "");
    const statusAllowsEdit = status === "REGISTRADA" || status === "EM_ANALISE";

    if (!statusAllowsEdit) return false;

    return isAdminOrMod || isOwner;
  }, [state.selected, me]);

  const readOnlyReason = React.useMemo(() => {
    const selected = state.selected;
    const myId = me?.id;
    const myRole = me?.role;

    if (!selected) return null;
    if (!myId) return "Carregando usuário...";

    const isAdminOrMod = myRole === "ADMIN" || myRole === "MODERADOR";
    const isOwner =
      Number(selected?.resident?.id ?? selected?.residentId) === Number(myId);

    const status = String(selected.status ?? "");
    const statusAllowsEdit = status === "REGISTRADA" || status === "EM_ANALISE";

    if (!statusAllowsEdit)
      return "Ocorrências resolvidas não podem ser editadas.";
    if (!isOwner && !isAdminOrMod)
      return "Você pode visualizar, mas só o autor (ou moderador/admin) pode editar.";
    return null;
  }, [state.selected, me]);

  if (vm.isLoading) return <OccurrencesLoading />;

  const categoriesList = Array.isArray(vm.categories.data)
    ? vm.categories.data
    : [];

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
          <OccurrencesToolbar
            isNotebook={isNotebook}
            search={state.search}
            setSearch={state.setSearch}
            status={state.status}
            setStatus={state.setStatus}
            categoryId={state.categoryId}
            setCategoryId={state.setCategoryId}
            categories={categoriesList}
            categoriesIsError={vm.categories.isError}
            categoriesIsLoading={vm.categories.isLoading}
            categoriesErrorMessage={
              vm.categories.isError
                ? String(
                    (vm.categories.error as Error)?.message ??
                      "Erro ao buscar categorias",
                  )
                : null
            }
            onReset={state.resetFilters}
          />

          <OccurrencesTable
            isMobile={isMobile}
            isNotebook={isNotebook}
            items={vm.items}
            order={state.order}
            orderBy={state.orderBy}
            onRequestSort={state.handleRequestSort}
            onOpenDetails={state.openDetails}
            selectedId={state.selected?.id ?? null}
            detailsOpen={state.detailsOpen}
            isLoading={vm.occurrences.isLoading}
            onAskDelete={askDelete}
            canDelete={canDelete}
            deleteTooltip={deleteTooltip}
          />

          <OccurrencesPagination
            page={state.page}
            totalPages={vm.totalPages}
            onChange={state.setPage}
            isMobile={isMobile}
          />
        </Paper>

        <DialogDetails
          detailsOpen={state.detailsOpen}
          closeDetails={state.closeDetails}
          isMobile={isMobile}
          isNotebook={isNotebook}
          selected={state.selected}
          canEdit={canEdit}
          readOnlyReason={canEdit ? null : readOnlyReason}
        />

        <ConfirmDeleteOccurrenceDialog
          open={deleteOpen}
          occurrence={deleteTarget}
          isPending={deleteOccurrence.isPending}
          onClose={closeDelete}
          onConfirm={async (occ) => {
            await deleteOccurrence.mutateAsync(occ.id);
            closeDelete();
          }}
        />
      </Box>
    </LayoutContainer>
  );
}
