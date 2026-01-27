import { CreateOccurrencePayload } from "./types";

export async function fetchOccurrences() {
  const res = await fetch("/api/occurrences", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas ocorrências");
  return res.json();
}

export async function createOccurrence(payload: CreateOccurrencePayload) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL não configurada");

  const res = await fetch(`${baseUrl}/occurrences`, {
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
