import { env } from "@/shared/lib/env";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const apiBase = env.apiBaseUrl;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.cookieName)?.value;
    if (!apiBase) {
      return new Response(
        JSON.stringify({ message: "API_URL não configurada" }),
        { status: 500 },
      );
    }

    const body = await req.json();

    const { title, riskLevel } = body ?? {};

    if (!title || !riskLevel) {
      return new Response(
        JSON.stringify({ message: "Campos obrigatórios ausentes" }),
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${apiBase}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, riskLevel }),
    });

    const data = await backendRes.json().catch(() => null);
    return new Response(JSON.stringify(data), { status: backendRes.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Erro interno do servidor", error }),
      { status: 500 },
    );
  }
}
