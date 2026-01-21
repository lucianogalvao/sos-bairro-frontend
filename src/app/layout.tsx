import type { Metadata } from "next";
import "@/app/styles/globals.scss";
import { Montserrat } from "next/font/google";
import { AppThemeProvider } from "./providers";
import { QueryProvider } from "@/providers/QueryProvider";
import { cookies } from "next/headers";

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

  return (
    <html lang="pt-BR" data-theme={initialMode}>
      <body className={montserrat.variable}>
        <QueryProvider>
          <AppThemeProvider initialMode={initialMode}>
            {children}
          </AppThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
