import { RiskLevel } from "@/features/dashboard/types";

export async function fetchCategories() {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas categorias");
  return res.json();
}

export async function newCategory(title: string, riskLevel: RiskLevel) {
  const res = await fetch(`/api/categories/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ title: title.trim(), riskLevel }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao criar categoria");
  }

  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.message ?? "Falha ao excluir categoria",
      data.message,
    );
  }
}

export async function updateCategory(
  id: number,
  body: { title?: string; riskLevel?: RiskLevel },
) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao atualizar categoria");
  }

  return data;
}
