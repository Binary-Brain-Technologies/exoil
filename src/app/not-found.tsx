import type { Metadata } from "next";
import Link from "next/link";
import { TankerSvg } from "@/components/home/TankerSvg";

export const metadata: Metadata = { title: "Nie znaleziono strony", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="bg-night text-tank">
      <div className="frame py-24 lg:py-32">
        <p className="label text-night-muted">Błąd 404 · adres nieznany</p>
        <h1 className="display mt-6 max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)]">Ta trasa nigdzie nie prowadzi.</h1>
        <p className="mt-6 max-w-xl text-lg text-tank/80">
          Strony pod tym adresem nie ma — mogła zmienić adres po przebudowie serwisu. Wybierz jeden z kierunków poniżej.
        </p>
        <TankerSvg className="mt-12 w-full max-w-lg opacity-90" />
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-display text-lg font-bold">
          {[
            ["/", "Strona główna"],
            ["/hurt-paliw/", "Hurt paliw"],
            ["/dostawy/", "Dostawy"],
            ["/stacje/", "Stacje"],
            ["/kontakt/", "Kontakt"],
          ].map(([href = "/", label]) => (
            <li key={href}>
              <Link href={href} className="underline decoration-exoil-red decoration-2 underline-offset-8 hover:text-white">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
