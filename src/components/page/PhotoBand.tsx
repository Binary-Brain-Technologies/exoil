import Image from "next/image";
import { getPhoto, type PhotoId } from "@/data/media";
import { needsMarker } from "@/lib/verification";

/** Full-bleed operational photograph. Renders nothing until the photo's rights are confirmed (review mode: marked). */
export function PhotoBand({ id }: { id: PhotoId }) {
  const photo = getPhoto(id);
  if (!photo) return null;
  const marked = needsMarker(photo.record);
  return (
    <figure className={`bg-night ${marked ? "unverified" : ""}`} title={marked ? photo.record.source : undefined}>
      <Image src={photo.src} alt={photo.alt} sizes="100vw" className="h-auto w-full" placeholder="blur" />
      <figcaption className="frame label py-3 text-[0.7rem] text-night-muted">{photo.caption}</figcaption>
    </figure>
  );
}
