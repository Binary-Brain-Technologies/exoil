"use client";

import Link from "next/link";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="bg-night text-tank">
      <div className="frame py-24 lg:py-32">
        <p className="label text-night-muted">Błąd strony</p>
        <h1 className="display mt-6 max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)]">Coś zatrzymało się na trasie.</h1>
        <p className="mt-6 max-w-xl text-lg text-tank/80">Nie udało się wyświetlić tej strony. Spróbuj ponownie albo wróć na stronę główną.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep">
            Spróbuj ponownie
          </button>
          <Link href="/" className="inline-flex h-13 items-center border-2 border-tank/70 px-6 font-display text-lg font-bold hover:bg-tank hover:text-carbon">
            Strona główna
          </Link>
        </div>
      </div>
    </section>
  );
}
