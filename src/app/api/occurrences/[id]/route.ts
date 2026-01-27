import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const baseUrl = env.apiBaseUrl;
  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;
  const { id } = await params;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "API_URL não configurada" },
      { status: 500 },
    );
  }

  const res = await fetch(`${baseUrl}/occurrences/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Erro ao deletar ocorrência" },
      { status: res.status },
    );
  }

  return NextResponse.json({ success: true });
}
