import { NextResponse } from "next/server";

interface GeocodeResult {
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  formatted_address?: string;
}

interface GeocodeResponse {
  status?: string;
  results?: GeocodeResult[];
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    address?: string;
  } | null;
  const address = body?.address?.trim();

  if (!address) {
    return NextResponse.json(
      { message: "address é obrigatório" },
      { status: 400 },
    );
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { message: "Google Maps API key não configurada" },
      { status: 500 },
    );
  }

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(address)}` +
    `&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = (await res.json().catch(() => null)) as GeocodeResponse | null;

  if (!res.ok) {
    return NextResponse.json(
      { message: "Falha ao consultar geocode" },
      { status: 500 },
    );
  }

  if (!data || data.status !== "OK" || !data.results?.[0]) {
    return NextResponse.json(
      { message: "Endereço não encontrado", status: data?.status },
      { status: 422 },
    );
  }

  const best = data.results[0];
  const lat = best.geometry?.location?.lat;
  const lng = best.geometry?.location?.lng;

  return NextResponse.json(
    { lat, lng, formattedAddress: best.formatted_address },
    { status: 200 },
  );
}
