import type { Role } from "@/store/types";
import type { AuthUser } from "@/store/types";
import { ApiErrorResponse, ProfileForm } from "./types";

type UpdateUserRoleResponse = unknown;

export async function fetchUsers() {
  const res = await fetch("/api/users", {
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
  const res = await fetch(`/api/users/${params.id}/role`, {
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

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function isAuthUser(x: unknown): x is AuthUser {
  return (
    !!x &&
    typeof x === "object" &&
    "id" in x &&
    "name" in x &&
    "email" in x &&
    "role" in x
  );
}

type UploadResponse = {
  imageUrl?: string;
  avatarUrl?: string;
  message?: string;
};

export async function uploadAvatarIfNeeded(file: File | null) {
  if (!file) return "";

  const upload = new FormData();
  upload.append("file", file);

  const uploadRes = await fetch("/api/uploads/image", {
    method: "POST",
    body: upload,
    credentials: "include",
  });

  const uploadData = (await uploadRes
    .json()
    .catch(() => null)) as UploadResponse | null;

  if (!uploadRes.ok) {
    throw new Error(uploadData?.message ?? "Falha ao enviar imagem");
  }

  return (uploadData?.avatarUrl ?? uploadData?.imageUrl ?? "").trim() || "";
}

export async function updateMe(payload: {
  name: string;
  address: string;
  avatarUrl: string | null;
}): Promise<{
  updatedUser: AuthUser | null;
  formFallback: Partial<ProfileForm>;
}> {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await safeJson<AuthUser | ApiErrorResponse>(res);

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Falha ao salvar perfil";
    throw new Error(String(msg));
  }

  if (isAuthUser(data)) {
    return { updatedUser: data, formFallback: {} };
  }

  return {
    updatedUser: null,
    formFallback: {
      name: payload.name,
      address: payload.address,
      avatarUrl: payload.avatarUrl,
    },
  };
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const data = await safeJson<ApiErrorResponse>(res);
    throw new Error(data?.message ?? "Falha ao excluir usuário");
  }
}
