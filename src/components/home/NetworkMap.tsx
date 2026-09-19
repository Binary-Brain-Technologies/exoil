import { townPosition, type Station } from "@/data/stations";

/**
 * Schematic network: routes from Chełm out to every published station.
 * Positions are town-level (townPosition, ~1 km) and only used for layout — not a map, not coordinates.
 * A single labelled graphic (role="img"): it holds no links; the station list next to it is the navigable version.
 */
const BOUNDS = { minLng: 22.52, maxLng: 23.66, minLat: 50.66, maxLat: 51.32 };
const W = 640;
const H = 520;
const PAD = 48;

function project(lat: number, lng: number) {
  const k = Math.cos((51 * Math.PI) / 180);
  const spanX = (BOUNDS.maxLng - BOUNDS.minLng) * k;
  const spanY = BOUNDS.maxLat - BOUNDS.minLat;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  return {
    x: PAD + (lng - BOUNDS.minLng) * k * scale,
    y: PAD + (BOUNDS.maxLat - lat) * scale,
  };
}

/** Label placement tweaks for stations that sit close together (presentation only). */
const LABEL_BELOW = new Set(["hutnicza"]);
const MIN_GAP = 22;

/** Octilinear route (45° then straight), like a transit diagram — reads as a planned run, not a map line. */
function route(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.min(Math.abs(dx), Math.abs(dy));
  const mx = a.x + Math.sign(dx) * d;
  const my = a.y + Math.sign(dy) * d;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Projects every station and nudges nodes that would overlap the ones before them. */
function layout(stations: Station[]) {
  const placed: Array<{ s: Station; x: number; y: number }> = [];
  for (const s of stations) {
    const t = townPosition(s);
    const p = project(t.lat, t.lng);
    for (const q of placed) {
      if (Math.hypot(q.x - p.x, q.y - p.y) < MIN_GAP) p.y = q.y + MIN_GAP;
    }
    placed.push({ s, ...p });
  }
  return placed;
}

export function NetworkMap({ stations, hubId = "okszowska" }: { stations: Station[]; hubId?: string }) {
  const hub = stations.find((s) => s.id === hubId) ?? stations[0];
  if (!hub) return null;
  const nodes = layout(stations);
  const h = nodes.find((n) => n.s.id === hub.id) ?? nodes[0]!;
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="network-title network-desc">
        <title id="network-title">Schemat sieci stacji EXOIL</title>
        <desc id="network-desc">
          {`Trasy z Chełma do stacji: ${stations.map((s) => s.shortName).join(", ")}. Położenie przybliżone.`}
        </desc>
        {/* Faint grid, like a dispatcher's planning sheet */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={(i * W) / 8} y1="0" x2={(i * W) / 8} y2={H} stroke="#3A3431" strokeWidth="1" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i * H) / 6} x2={W} y2={(i * H) / 6} stroke="#3A3431" strokeWidth="1" />
        ))}
        {nodes
          .filter((n) => n.s.id !== hub.id)
          .map((n) => (
            <path key={n.s.id} d={route(h, n)} fill="none" stroke="#DA251D" strokeWidth="2.5" strokeLinejoin="round" className="network-route" pathLength={1} />
          ))}
        {nodes.map(({ s, x, y }) => {
          const isHub = s.id === hub.id;
          const below = LABEL_BELOW.has(s.id);
          const p = { x, y };
          return (
            <g key={s.id}>
              <rect
                x={p.x - (isHub ? 9 : 7)}
                y={p.y - (isHub ? 9 : 7)}
                width={isHub ? 18 : 14}
                height={isHub ? 18 : 14}
                fill={isHub ? "#DA251D" : "#121010"}
                stroke={isHub ? "#F2F2EF" : "#DA251D"}
                strokeWidth="2.5"
              />
              <text
                x={p.x + 16}
                y={p.y + 5}
                fill="#F2F2EF"
                stroke="#121010"
                strokeWidth="5"
                paintOrder="stroke"
                strokeLinejoin="round"
                fontSize="15"
                fontFamily="var(--font-plex-sans)"
                data-below={below || undefined}
              >
                {s.shortName}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="label mt-3 text-[0.65rem] text-night-muted">Schemat — położenie stacji przybliżone</figcaption>
    </figure>
  );
}
