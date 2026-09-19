import Image from "next/image";
import logo from "../../../public/brand/exoil-logo-on-white.png";

/**
 * The EXOIL logo, exactly as recovered (docs/brand-assets.md). Always on white.
 * Never recolour, redraw, crop the mark or scale beyond ~180 CSS px (source is a 512 px raster).
 * Replace the file with the client's vector original when supplied.
 */
export function Logo({ width = 132, priority = false, className = "" }: { width?: number; priority?: boolean; className?: string }) {
  const w = Math.min(Math.max(width, 104), 180);
  return (
    <span className={`inline-block bg-paper ${className}`} style={{ lineHeight: 0 }}>
      <Image
        src={logo}
        alt="EXOIL"
        width={w}
        height={Math.round((w * 192) / 512)}
        priority={priority}
        sizes={`${w}px`}
        quality={90}
      />
    </span>
  );
}
