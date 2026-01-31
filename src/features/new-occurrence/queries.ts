"use client";

import { fetchMyOccurrences } from "@/shared/api/occurrences";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateOccurrencePayload = {
  description: string;
  categoryId: number;
  address: string;
  imageUrl?: string;
  locationLatitude: number;
  locationLongitude: number;
};

async function createOccurrence(payload: CreateOccurrencePayload) {
  const res = await fetch("/api/occurrences/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      (typeof data?.message === "string" && data.message) ||
        "Falha ao criar ocorrência",
    );
  }

  return data;
}

export function useCreateOccurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOccurrencePayload) => createOccurrence(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["occurrences", "my-occurrences"],
        exact: false,
      });
    },
  });
}

export const myOccurrencesQueries = {
  occurrences: () => ({
    queryKey: ["my-occurrences"],
    queryFn: fetchMyOccurrences,
  }),
};
