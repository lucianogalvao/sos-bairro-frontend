import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  if (!token)
    return NextResponse.json({ ok: true, user: null }, { status: 200 });

  const res = await fetch(`${env.apiBaseUrl}/users/my-profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ user: null }, { status: 200 });

  const user = await res.json();
  return NextResponse.json({ user }, { status: 200 });
}
