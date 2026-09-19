import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "EXOIL — hurt i dostawy paliw, stacje paliw";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview: the unmodified logo file on its white plate, over the night route. */
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "brand", "exoil-logo-on-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#121010", padding: 72 }}>
        <div style={{ display: "flex", background: "#ffffff", padding: 20, alignSelf: "flex-start" }}>
          <img src={logoSrc} width={320} height={120} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, color: "#F2F2EF", letterSpacing: -2 }}>Energia w ruchu.</div>
          <div style={{ fontSize: 34, color: "#A29D98", marginTop: 16 }}>Hurt paliw · dostawy autocysternami · stacje paliw</div>
        </div>
        <div style={{ display: "flex", height: 6, background: "#DA251D", width: "62%" }} />
      </div>
    ),
    size,
  );
}
