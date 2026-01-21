import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ?? "10";

  const cookieStore = await cookies();
  const token = cookieStore.get(env.cookieName)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const qs = new URLSearchParams({
    page: "1",
    pageSize: limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const res = await fetch(`${env.apiBaseUrl}/occurrences?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
