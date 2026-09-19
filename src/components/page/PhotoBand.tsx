import Image from "next/image";
import { getPhoto, type PhotoId } from "@/data/media";

/** Full-bleed operational photograph. */
export function PhotoBand({ id }: { id: PhotoId }) {
  const photo = getPhoto(id);
  if (!photo) return null;
  return (
    <figure className="bg-night">
      <Image src={photo.src} alt={photo.alt} sizes="100vw" className="h-auto w-full" placeholder="blur" />
      <figcaption className="frame label py-3 text-[0.7rem] text-night-muted">{photo.caption}</figcaption>
    </figure>
  );
}
