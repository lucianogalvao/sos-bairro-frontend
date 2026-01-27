export async function uploadOccurrenceImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/uploads/image", {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as { imageUrl?: string; message?: string };

  if (!res.ok || !data.imageUrl) {
    throw new Error(data?.message ?? "Falha ao enviar imagem");
  }

  return data.imageUrl;
}
