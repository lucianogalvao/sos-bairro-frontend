import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

type Params = { id: string };

export async function PATCH(req: Request, ctx: { params: Promise<Params> }) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = (await safeJson(req)) as { status?: string } | null;

  if (!body?.status) {
    return NextResponse.json(
      { message: "Campo 'status' é obrigatório" },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${env.apiBaseUrl}/occurrences/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({ status: body.status }),
  });

  if (!upstream.ok) {
    const msg = await safeJson(upstream);
    return NextResponse.json(msg ?? { message: "Erro ao alterar status" }, {
      status: upstream.status,
    });
  }

  const data = await safeJson(upstream);
  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}

async function safeJson(input: Request | Response) {
  try {
    return await (input as Response).json();
  } catch {
    try {
      const text = await (input as Request).text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }
}
