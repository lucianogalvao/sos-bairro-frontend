export async function fetchCategories() {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar últimas categorias");
  return res.json();
}
