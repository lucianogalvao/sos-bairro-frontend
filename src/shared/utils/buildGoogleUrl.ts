function buildGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function buildGoogleMapsEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

export { buildGoogleMapsUrl, buildGoogleMapsEmbedUrl };
