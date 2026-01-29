import { CreateOccurrencePayload } from "./types";

export async function fetchOccurrences() {
  const res = await fetch("/api/occurrences", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas ocorrências");
  return res.json();
}

export async function createOccurrence(payload: CreateOccurrencePayload) {
  const res = await fetch("/api/occurrences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao criar ocorrência");
  }

  return data;
}

export async function deleteOccurrence(id: number): Promise<void> {
  const res = await fetch(`/api/occurrences/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Falha ao excluir ocorrência");
  }
}

type ApiError = { message?: string };

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type UpdateOccurrencePayload = {
  id: number;
  description?: string;
  categoryId?: number;
  address?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export async function updateOccurrence(payload: UpdateOccurrencePayload) {
  const res = await fetch(`/api/occurrences/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
      ...(payload.categoryId !== undefined
        ? { categoryId: payload.categoryId }
        : {}),
      ...(payload.address !== undefined ? { address: payload.address } : {}),
      ...(payload.locationLatitude !== undefined
        ? { locationLatitude: payload.locationLatitude }
        : {}),
      ...(payload.locationLongitude !== undefined
        ? { locationLongitude: payload.locationLongitude }
        : {}),
    }),
  });

  const data = await safeJson<ApiError & Record<string, unknown>>(res);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao atualizar ocorrência");
  }

  return data;
}
