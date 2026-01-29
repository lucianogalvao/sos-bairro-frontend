import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/shared/lib/env";

type Role = "MODERADOR" | "MORADOR";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  const body = (await req.json().catch(() => null)) as { role?: Role } | null;

  if (!body?.role || (body.role !== "MODERADOR" && body.role !== "MORADOR")) {
    return NextResponse.json({ message: "Role inválida" }, { status: 400 });
  }

  const upstream = await fetch(`${env.apiBaseUrl}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: body.role }),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Falha ao atualizar papel do usuário" },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data ?? { success: true });
}
