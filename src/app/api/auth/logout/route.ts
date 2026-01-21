import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export async function POST() {
  const cookieStore = await cookies();

  // Forma preferida (Next 13+ / 14 / 15 / 16):
  cookieStore.delete(env.cookieName);

  // Fallback extra (ajuda quando houve set com atributos específicos)
  cookieStore.set(env.cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", // precisa bater com o do login
    maxAge: 0,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
