import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/data/company";
import { JsonLd, organizationLd } from "@/lib/jsonld";
import { isIndexable } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EXOIL — hurt i dostawy paliw, stacje paliw | Chełm",
    template: "%s | EXOIL",
  },
  description:
    "Exoil Paliwa Sp. z o.o. z Chełma: hurtowa sprzedaż paliw, dostawy oleju napędowego i opałowego własnymi autocysternami oraz stacje paliw EXOIL w województwie lubelskim.",
  applicationName: "EXOIL",
  // Indexable by default; previews/review builds are noindex. Pages add their own noindex where needed.
  ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        {/* Marks JS availability before paint so progressive enhancements never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#tresc"
          className="sr-only z-[100] bg-carbon px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Przejdź do treści
        </a>
        <Header />
        <main id="tresc" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
