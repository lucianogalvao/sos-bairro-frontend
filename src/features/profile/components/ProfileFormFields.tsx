"use client";

import * as React from "react";
import { Stack, TextField } from "@mui/material";
import { ProfileForm } from "@/shared/api/types";

export function ProfileFormFields({
  form,
  setForm,
  isEditing,
  isSaving,
}: {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
  isSaving: boolean;
}) {
  return (
    <Stack spacing={1.5}>
      <TextField
        label="Nome"
        value={form.name}
        onChange={(e) =>
          setForm((prev: ProfileForm) => ({ ...prev, name: e.target.value }))
        }
        fullWidth
        disabled={!isEditing || isSaving}
      />

      <TextField
        label="Email"
        value={form.email}
        fullWidth
        disabled
        helperText="Email não pode ser alterado"
      />

      <TextField
        label="Endereço"
        value={form.address}
        onChange={(e) =>
          setForm((prev: ProfileForm) => ({ ...prev, address: e.target.value }))
        }
        fullWidth
        disabled={!isEditing || isSaving}
        placeholder="Rua, número, bairro, cidade"
      />
    </Stack>
  );
}
