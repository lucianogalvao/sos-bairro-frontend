export const env = {
  apiBaseUrl: process.env.BACKEND_URL ?? "",
  cookieName: process.env.COOKIE_NAME ?? "sosbairro_token",
};

if (!env.apiBaseUrl) {
  throw new Error("API_BASE_URL não definido no .env.local");
}
