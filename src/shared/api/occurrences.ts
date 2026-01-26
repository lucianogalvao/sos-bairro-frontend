export async function fetchOccurrences() {
  const res = await fetch("/api/occurrences", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas ocorrências");
  return res.json();
}
