export async function fetchOverview() {
  const res = await fetch("/api/reports/overview", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar overview");
  return res.json();
}

export async function fetchLatestOccurrences() {
  const res = await fetch("/api/occurrences/latest", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas ocorrências");
  return res.json();
}
