import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;

    const cookieStore = await cookies();
    const token = cookieStore.get(env.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const upstream = await fetch(`${env.apiBaseUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (upstream.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await safeJson(upstream);

    if (!upstream.ok) {
      return NextResponse.json(
        {
          message:
            (typeof data?.message === "string" && data.message) ||
            "Falha ao excluir usuário",
        },
        { status: upstream.status },
      );
    }

    return NextResponse.json(data ?? null, { status: upstream.status });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 },
    );
  }
}
