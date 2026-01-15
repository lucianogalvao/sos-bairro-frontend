import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function POST(req: Request) {
  const body = (await req.json()) as { email: string; password: string };

  const res = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await safeJson(res);
    return NextResponse.json(msg ?? { message: "Login inválido" }, {
      status: res.status,
    });
  }

  const data = (await res.json()) as { token: string; user: unknown };

  const cookieStore = await cookies();
  cookieStore.set(env.cookieName, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dia
  });

  return NextResponse.json({ user: data.user }, { status: 200 });
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
