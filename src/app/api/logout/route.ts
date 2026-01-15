import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(env.cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
