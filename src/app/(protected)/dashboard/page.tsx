import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MeResponse } from "@/types";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sosbairro_token")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/users/my-profile`, {
    cache: "no-store",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) redirect("/login");
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);

  const data = JSON.parse(text);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>
        Olá, <b>{data.name}</b> {data.role}
      </p>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
