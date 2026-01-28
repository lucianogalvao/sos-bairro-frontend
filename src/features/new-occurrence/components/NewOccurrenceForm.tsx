"use client";

import * as React from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AddressAutocomplete from "./AddressAutocomplete";
import { categoriesQueries } from "@/features/occurences/queries";
import { OccurrenceCategory } from "@/features/dashboard/types";
import { useRouter } from "next/navigation";

type Geo = { lat: number; lng: number };

export default function NewOccurrenceForm() {
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | "">("");
  const [address, setAddress] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const [geo, setGeo] = React.useState<Geo | null>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const categoriesQuery = useQuery(categoriesQueries.categories());
  const categories = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data?.items;
  const categoriesSafe = Array.isArray(categories) ? categories : [];
  const router = useRouter();

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
    const apiBase = process.env.NEXT_PUBLIC_APP_URL;
    if (!apiBase) {
      console.error("NEXT_PUBLIC_APP_URL não configurada");
      return;
    }

    if (!description || !categoryId) return;
    if (!geo?.lat || !geo?.lng || !address) {
      console.error("Endereço/latitude/longitude são obrigatórios");
      return;
    }

    try {
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

      const res = await fetch(`${apiBase}/api/occurrences/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          (typeof data?.message === "string" && data.message) ||
          "Falha ao criar ocorrência";
        throw new Error(msg);
      }

      router.push("/dashboard");
    } catch (e) {
      console.error("Erro ao salvar ocorrência:", e);
    }
  }

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
          disabled={categoriesQuery.isLoading || categoriesQuery.isFetching}
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
            setGeo({
              lat: data.lat,
              lng: data.lng,
            });
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
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {previewUrl && (
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
          )}
        </Stack>

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!description || !categoryId || !geo || !address}
        >
          Salvar ocorrência
        </Button>
      </Stack>
    </Box>
  );
}
