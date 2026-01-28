import { NextResponse } from "next/server";
import { env } from "@/shared/lib/env";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiBase = env.apiBaseUrl;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.cookieName)?.value;
    if (!apiBase) {
      return NextResponse.json(
        { message: "API_URL não configurada" },
        { status: 500 },
      );
    }

    const body = await req.json();

    const {
      description,
      categoryId,
      address,
      imageUrl,
      locationLatitude,
      locationLongitude,
    } = body ?? {};

    if (
      !description ||
      !categoryId ||
      !address ||
      !locationLatitude ||
      !locationLongitude
    ) {
      return NextResponse.json(
        { message: "Campos obrigatórios ausentes" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${apiBase}/occurrences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
        categoryId,
        address,
        imageUrl,
        locationLatitude,
        locationLongitude,
      }),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Erro no backend" },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar ocorrência:", err);
    return NextResponse.json(
      { message: "Erro inesperado ao criar ocorrência" },
      { status: 500 },
    );
  }
}
