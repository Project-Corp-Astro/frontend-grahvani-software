import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { VedicClientProvider } from "@/context/VedicClientContext";
import { AstrologerSettingsProvider } from "@/context/AstrologerSettingsContext";

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
  title: "Grahvani - Astrology Software",
  description: "Professional astrology software for astrologers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <VedicClientProvider>
          <AstrologerSettingsProvider>
            <GlobalHeader />
            {children}
          </AstrologerSettingsProvider>
        </VedicClientProvider>
      </body>
    </html>
  );
}

