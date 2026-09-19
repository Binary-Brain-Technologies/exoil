import { isReviewMode } from "@/lib/verification";

export function ReviewBanner() {
  if (!isReviewMode()) return null;
  return (
    <div role="note" className="bg-adr text-carbon">
      <p className="frame py-2 text-sm">
        <strong>Tryb weryfikacji treści.</strong> Pola w kreskowanej ramce pochodzą ze starej strony lub źródeł wtórnych i
        czekają na potwierdzenie. Strona nie jest indeksowana.
      </p>
    </div>
  );
}
