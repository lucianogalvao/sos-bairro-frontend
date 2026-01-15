import type { Metadata } from "next";
import "@/app/styles/globals.scss";
import { Montserrat } from "next/font/google";
import { AppThemeProvider } from "./providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.variable}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
