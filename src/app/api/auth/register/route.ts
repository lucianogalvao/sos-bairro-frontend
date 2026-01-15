import { env } from "@/shared/lib/env";
import { NextResponse } from "next/server";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;

    const apiUrl = env.apiBaseUrl;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "Missing API_URL env var" },
        { status: 500 }
      );
    }

    const registerRes = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!registerRes.ok) {
      const text = await registerRes.text().catch(() => "");
      return NextResponse.json(
        { message: "Register failed", details: text },
        { status: registerRes.status }
      );
    }

    const loginRes = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    if (!loginRes.ok) {
      const text = await loginRes.text().catch(() => "");
      return NextResponse.json(
        { message: "Auto-login failed", details: text },
        { status: loginRes.status }
      );
    }

    const data = (await loginRes.json()) as {
      token: string;
      user: { id: number; name: string; email: string; role: string };
    };

    const isProd = process.env.NODE_ENV === "production";

    const res = NextResponse.json({ user: data.user }, { status: 201 });
    res.cookies.set("sos.token", data.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return res;
  } catch {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
