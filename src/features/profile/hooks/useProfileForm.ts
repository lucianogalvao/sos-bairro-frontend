"use client";

import * as React from "react";
import type { ProfileForm } from "@/shared/api/types";

function getInitials(name?: string | null) {
  const n = String(name ?? "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

export function useProfileForm({ original }: { original: ProfileForm }) {
  const [form, setForm] = React.useState<ProfileForm>(original);

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(original);
    setIsEditing(false);
    setIsSaving(false);
    setError(null);
    setSuccess(null);
    setAvatarFile(null);
    setAvatarPreview(null);
  }, [original]);

  React.useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const startEditing = React.useCallback(() => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  }, []);

  const cancelEditing = React.useCallback(() => {
    setForm(original);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setAvatarFile(null);
    setAvatarPreview(null);
  }, [original]);

  const removeAvatar = React.useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setForm((prev) => ({ ...prev, avatarUrl: null }));
  }, []);

  const canSave = form.name.trim().length > 0 && form.address.trim().length > 0;

  const avatarSrc = avatarPreview || form.avatarUrl || undefined;
  const initials = getInitials(form.name);

  return {
    form,
    setForm,

    isEditing,
    setIsEditing,
    startEditing,
    cancelEditing,

    isSaving,
    setIsSaving,

    error,
    setError,
    success,
    setSuccess,

    avatarFile,
    setAvatarFile,
    avatarPreview,
    avatarSrc,
    initials,

    removeAvatar,

    canSave,
  };
}
