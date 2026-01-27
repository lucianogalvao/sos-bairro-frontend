import type { Metadata } from "next";
import "@/app/styles/globals.scss";
import { Montserrat } from "next/font/google";
import { AppThemeProvider } from "./providers";
import { QueryProvider } from "@/providers/QueryProvider";
import { cookies } from "next/headers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SOS Bairro",
  icons: {
    icon: "/favicon.ico",
  },
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Mode = "light" | "dark";

async function getInitialModeFromCookie(): Promise<Mode> {
  const value = (await cookies()).get("sos_mode")?.value;
  return value === "light" || value === "dark" ? value : "dark";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialMode = await getInitialModeFromCookie();
  const key = process.env.GOOGLE_MAPS_API_KEY;
  return (
    <html lang="pt-BR" data-theme={initialMode}>
      <body className={montserrat.variable}>
        {key ? (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly`}
            strategy="afterInteractive"
          />
        ) : null}
        <QueryProvider>
          <AppThemeProvider initialMode={initialMode}>
            {children}
          </AppThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
