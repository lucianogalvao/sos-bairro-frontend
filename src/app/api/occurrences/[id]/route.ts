import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

type UpdateOccurrenceBody = {
  description?: string;
  categoryId?: number;
  address?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  const res = await fetch(`${env.apiBaseUrl}/occurrences/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Falha ao excluir ocorrência" },
      { status: res.status },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = (await req
    .json()
    .catch(() => null)) as UpdateOccurrenceBody | null;

  if (!body) {
    return NextResponse.json({ message: "Body inválido" }, { status: 400 });
  }

  const clean: UpdateOccurrenceBody = {};
  if (typeof body.description === "string")
    clean.description = body.description;
  if (typeof body.categoryId === "number") clean.categoryId = body.categoryId;
  if (typeof body.address === "string") clean.address = body.address;
  if (typeof body.locationLatitude === "number")
    clean.locationLatitude = body.locationLatitude;
  if (typeof body.locationLongitude === "number")
    clean.locationLongitude = body.locationLongitude;

  if (Object.keys(clean).length === 0) {
    return NextResponse.json(
      { message: "Envie ao menos um campo para atualizar" },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${env.apiBaseUrl}/occurrences/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clean),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Falha ao atualizar ocorrência" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data ?? { success: true });
}
