import { NextResponse } from "next/server";

interface CloudinaryResponse {
  secure_url: string;
  error?: { message: string };
}

export const runtime = "nodejs";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Arquivo 'file' é obrigatório" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { message: "Formato inválido. Envie uma imagem (jpg/png/webp/heic)." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        {
          message:
            "Cloudinary env vars ausentes (CLOUDINARY_CLOUD_NAME / CLOUDINARY_UPLOAD_PRESET)",
        },
        { status: 500 },
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", uploadPreset);
    uploadForm.append("folder", "sos-bairro/occurrences");

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm },
    );

    const data = (await cloudinaryRes.json()) as CloudinaryResponse;

    if (!cloudinaryRes.ok) {
      return NextResponse.json(
        { message: data?.error?.message ?? "Falha ao enviar imagem" },
        { status: 400 },
      );
    }

    return NextResponse.json({ imageUrl: data.secure_url }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado no upload" },
      { status: 500 },
    );
  }
}
