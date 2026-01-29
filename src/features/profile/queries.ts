"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type MeDTO = {
  id: number;
  name: string;
  email: string;
  address?: string | null;
  avatarUrl?: string | null;
  role?: string;
};

export type UpdateMePayload = {
  name?: string;
  address?: string | null;
  avatarUrl?: string | null;
};

export const meQuery = {
  key: ["me"] as const,
  queryFn: async (): Promise<MeDTO> => {
    const res = await fetch("/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message ?? "Falha ao buscar perfil");
    }

    return (await res.json()) as MeDTO;
  },
};

export async function updateMe(payload: UpdateMePayload): Promise<MeDTO> {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao atualizar perfil");
  }

  return data as MeDTO;
}

export function useMe() {
  return useQuery({
    queryKey: meQuery.key,
    queryFn: meQuery.queryFn,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMePayload) => updateMe(payload),
    onSuccess: async (updated) => {
      qc.setQueryData(meQuery.key, updated);
      await qc.invalidateQueries({ queryKey: meQuery.key });
    },
  });
}
