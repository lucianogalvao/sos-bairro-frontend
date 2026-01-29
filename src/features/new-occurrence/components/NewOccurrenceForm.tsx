"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AddressAutocomplete from "./AddressAutocomplete";
import { categoriesQueries } from "@/features/occurences/queries";
import type { OccurrenceCategory } from "@/features/dashboard/types";

type Geo = { lat: number; lng: number };

export default function NewOccurrenceForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | "">("");
  const [address, setAddress] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const [geo, setGeo] = React.useState<Geo | null>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const categoriesQuery = useQuery(categoriesQueries.categories());
  const categories = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data?.items;

  const categoriesSafe = Array.isArray(categories) ? categories : [];

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit() {
    setSubmitError(null);

    if (!description || !categoryId) return;

    if (!geo?.lat || !geo?.lng || !address) {
      setSubmitError("Endereço/latitude/longitude são obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);

      let finalImageUrl = imageUrl?.trim() || "";

      if (file) {
        const form = new FormData();
        form.append("file", file);

        const uploadRes = await fetch("/api/uploads/image", {
          method: "POST",
          body: form,
        });

        const uploadData = (await uploadRes.json().catch(() => null)) as {
          imageUrl?: string;
          message?: string;
        } | null;

        if (!uploadRes.ok || !uploadData?.imageUrl) {
          throw new Error(uploadData?.message ?? "Falha ao enviar imagem");
        }

        finalImageUrl = uploadData.imageUrl;
      }

      const payload = {
        description,
        categoryId: Number(categoryId),
        address,
        imageUrl: finalImageUrl || undefined,
        locationLatitude: geo.lat,
        locationLongitude: geo.lng,
      };

      const res = await fetch("/api/occurrences/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (typeof data?.message === "string" && data.message) ||
          "Falha ao criar ocorrência";
        throw new Error(msg);
      }

      await queryClient.invalidateQueries({
        queryKey: ["occurrences"],
        exact: false,
      });

      router.push("/ocorrencias");
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Erro ao salvar ocorrência",
      );
      console.error("Erro ao salvar ocorrência:", e);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    !!description && !!categoryId && !!geo && !!address && !isSubmitting;

  return (
    <Box>
      <Typography fontWeight={900} mb={2}>
        Nova ocorrência
      </Typography>

      <Stack spacing={2.2}>
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex. Som alto"
          multiline
          minRows={3}
          disabled={isSubmitting}
        />

        <TextField
          select
          label="Categoria"
          value={categoryId}
          onChange={(e) => {
            const v = String(e.target.value ?? "");
            setCategoryId(v ? Number(v) : "");
          }}
          fullWidth
          disabled={
            isSubmitting ||
            categoriesQuery.isLoading ||
            categoriesQuery.isFetching
          }
        >
          <MenuItem value="" disabled>
            Selecione
          </MenuItem>

          {categoriesSafe.map((c: OccurrenceCategory) => (
            <MenuItem key={c.id} value={c.id}>
              {c.title}
            </MenuItem>
          ))}
        </TextField>

        <AddressAutocomplete
          onPick={(data) => {
            setAddress(data.address);
            setGeo({ lat: data.lat, lng: data.lng });
          }}
        />

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Imagem
          </Typography>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={isSubmitting}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt="preview"
              sx={{
                width: "100%",
                maxHeight: 260,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
          ) : null}
        </Stack>

        {submitError ? (
          <Typography color="error" fontSize={13}>
            {submitError}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!canSubmit}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {isSubmitting ? "Salvando..." : "Salvar ocorrência"}
        </Button>
      </Stack>
    </Box>
  );
}
