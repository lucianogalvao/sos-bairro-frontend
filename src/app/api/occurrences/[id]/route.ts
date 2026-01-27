import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_APP_URL não configurada" },
      { status: 500 },
    );
  }

  const res = await fetch(`${baseUrl}/occurrences/${id}`, {
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
