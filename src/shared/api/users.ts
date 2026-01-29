import type { Role } from "@/store/types";

type UpdateUserRoleResponse = unknown;

export async function fetchUsers() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL não configurada");

  const res = await fetch(`${baseUrl}/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao carregar usuários");
  }

  return data;
}

export async function updateUserRole(params: {
  id: number;
  nextRole: Role;
}): Promise<UpdateUserRoleResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL não configurada");

  const res = await fetch(`${baseUrl}/api/users/${params.id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role: params.nextRole }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao atualizar papel do usuário");
  }

  return data;
}
