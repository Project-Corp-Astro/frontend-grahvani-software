import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { VedicClientProvider } from "@/context/VedicClientContext";


const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Grahvani - Vedic Astrology Software",
    template: "%s | Grahvani",
  },
  description:
    "Professional Vedic astrology software for astrologers. Generate birth charts, dashas, divisional charts, KP analysis, transit predictions, and matchmaking reports.",
  keywords: [
    "Vedic astrology",
    "Jyotish",
    "birth chart",
    "kundli",
    "horoscope",
    "dasha",
    "transit",
    "matchmaking",
    "astrology software",
  ],
  authors: [{ name: "AstroCorp" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://grahvani.in",
    siteName: "Grahvani",
    title: "Grahvani - Vedic Astrology Software",
    description:
      "Professional Vedic astrology software for astrologers. Generate birth charts, dashas, divisional charts, KP analysis, transit predictions, and matchmaking reports.",
  },
  twitter: {
    card: "summary",
    title: "Grahvani - Vedic Astrology Software",
    description:
      "Professional Vedic astrology software for astrologers.",
  },
  metadataBase: new URL("https://grahvani.in"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

import { AuthProvider } from "@/context/AuthContext";

import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <VedicClientProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-amber-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
              >
                Skip to main content
              </a>
              <GlobalHeader />
              <main id="main-content">
                {children}
              </main>
            </VedicClientProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

