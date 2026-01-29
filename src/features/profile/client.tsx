"use client";

import * as React from "react";
import { Alert, Box, Divider, Paper, Stack, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import LayoutContainer from "../common/LayoutContainer";
import { useAuthStore } from "@/store/useAuthStore";

import { useProfileForm } from "./hooks/useProfileForm";

import { ProfileHeader } from "./components/ProfileHeader";
import { AvatarField } from "./components/AvatarField";
import { ProfileFormFields } from "./components/ProfileFormFields";
import { ProfileActions } from "./components/ProfileActions";

import type { ProfileForm } from "@/shared/api/types";
import { updateMe, uploadAvatarIfNeeded } from "@/shared/api/users";

export default function ProfileClient() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const original = React.useMemo<ProfileForm>(() => {
    return {
      name: String(user?.name ?? ""),
      email: String(user?.email ?? ""),
      address: String(user?.address ?? ""),
      avatarUrl: user?.avatarUrl ?? null,
    };
  }, [user]);

  const vm = useProfileForm({ original });

  async function onSave() {
    try {
      vm.setError(null);
      vm.setSuccess(null);
      vm.setIsSaving(true);

      const uploadedUrl = await uploadAvatarIfNeeded(vm.avatarFile);

      const avatarUrl =
        uploadedUrl != null
          ? uploadedUrl.trim() || null
          : (vm.form.avatarUrl ?? null); // se removeu, fica null

      const payload = {
        name: vm.form.name.trim(),
        address: vm.form.address.trim(),
        avatarUrl,
      };

      const result = await updateMe(payload);

      if (result.updatedUser) {
        setUser(result.updatedUser);
      } else if (Object.keys(result.formFallback).length) {
        vm.setForm((prev) => ({ ...prev, ...result.formFallback }));
      }

      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      vm.setSuccess("Perfil atualizado com sucesso.");
      vm.cancelEditing();
    } catch (e) {
      vm.setError(e instanceof Error ? e.message : "Falha ao salvar perfil");
    } finally {
      vm.setIsSaving(false);
    }
  }

  return (
    <LayoutContainer>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          sx={{
            width: "100%",
            maxWidth: 720,
            p: { xs: 2, sm: 2.5 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack spacing={2}>
            <ProfileHeader
              name={vm.form.name}
              email={vm.form.email}
              avatarSrc={vm.avatarSrc}
              isEditing={vm.isEditing}
              onEdit={vm.startEditing}
            />

            <AvatarField
              isEditing={vm.isEditing}
              isSaving={vm.isSaving}
              onPickFile={vm.setAvatarFile}
              hasPreview={!!vm.avatarPreview}
              canRemove={!!(vm.avatarPreview || vm.form.avatarUrl)}
              onRemove={vm.removeAvatar}
            />

            <Divider />

            <ProfileFormFields
              form={vm.form}
              setForm={vm.setForm}
              isEditing={vm.isEditing}
              isSaving={vm.isSaving}
            />

            {vm.error ? <Alert severity="error">{vm.error}</Alert> : null}
            {vm.success ? <Alert severity="success">{vm.success}</Alert> : null}

            <ProfileActions
              isEditing={vm.isEditing}
              isSaving={vm.isSaving}
              canSave={vm.canSave}
              onCancel={vm.cancelEditing}
              onSave={onSave}
            />
          </Stack>
        </Paper>
      </Box>
    </LayoutContainer>
  );
}
