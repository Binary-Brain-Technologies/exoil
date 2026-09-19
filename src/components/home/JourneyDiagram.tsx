import { TankerShape } from "./TankerSvg";

/**
 * Static technical diagrams for each journey chapter. Used on mobile, with reduced motion,
 * without JavaScript and as the poster before WebGL loads. They carry the same story as the 3D scene.
 */
const ROAD = "#3B3F43";
const LINE = "#8B9095";
const RED = "#DA251D";

function Ground({ trace = false }: { trace?: boolean }) {
  return (
    <g>
      <rect x="0" y="182" width="560" height="18" fill="#1F1A17" />
      <line x1="0" y1="182" x2="560" y2="182" stroke={ROAD} strokeWidth="2" />
      {trace && <line x1="0" y1="190" x2="120" y2="190" stroke={RED} strokeWidth="4" />}
    </g>
  );
}

/**
 * `doubleWall` shows the double-wall tank concept (outer wall + inner tank). Only when the customer-tank offer
 * is confirmed (services "tanks"); otherwise the customer tank is drawn as a plain tank with its level.
 */
export function JourneyDiagram({ step, className = "", doubleWall = false }: { step: number; className?: string; doubleWall?: boolean }) {
  return (
    <svg viewBox="0 0 560 200" className={className} aria-hidden="true" focusable="false">
      {step === 0 && (
        <g>
          <Ground />
          <path d="M556 150 L720 120 L720 190 Z" fill="#FFF1D6" opacity="0.08" transform="translate(-160 0)" />
          <TankerShape x={40} y={42} />
          <line x1="0" y1="191" x2="36" y2="191" stroke={RED} strokeWidth="4" />
        </g>
      )}
      {step === 1 && (
        <g>
          <Ground />
          {/* Gantry */}
          <rect x="150" y="6" width="220" height="10" fill={LINE} />
          <rect x="156" y="16" width="8" height="166" fill={LINE} />
          <rect x="356" y="16" width="8" height="166" fill={LINE} />
          <rect x="235" y="16" width="6" height="58" fill="#C9CCCF" />
          <TankerShape x={40} y={42} compartments={0.62} />
        </g>
      )}
      {step === 2 && (
        <g>
          <Ground trace />
          <line x1="120" y1="190" x2="560" y2="190" stroke={ROAD} strokeWidth="2" strokeDasharray="14 12" />
          <TankerShape x={70} y={42} />
          {[140, 300, 460].map((x) => (
            <circle key={x} cx={x} cy="24" r="4" fill="none" stroke={LINE} strokeWidth="1.5" />
          ))}
          <path d="M20 24 H540" stroke={LINE} strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="20" cy="24" r="5" fill={RED} />
        </g>
      )}
      {step === 3 && (
        <g>
          <Ground trace />
          <g transform="translate(-40 0) scale(0.82) translate(0 44)">
            <TankerShape x={0} y={42} />
          </g>
          {/* Customer tank */}
          <rect x="440" y="84" width="84" height="98" rx="6" fill="#8B9095" stroke="#1F1A17" strokeWidth="2" />
          <rect x="474" y="76" width="16" height="9" fill={RED} />
          {/* Hose */}
          <path d="M232 170 C 300 196, 380 196, 440 150" fill="none" stroke="#F08A00" strokeWidth="5" strokeDasharray="12 8" />
        </g>
      )}
      {step === 4 && (
        <g>
          <Ground />
          {doubleWall ? (
            <>
              <rect x="190" y="34" width="180" height="148" rx="10" fill="none" stroke={LINE} strokeWidth="3" strokeDasharray="8 6" />
              <rect x="206" y="48" width="148" height="126" rx="6" fill="#2A2624" stroke="#C9CCCF" strokeWidth="2" />
              <rect x="208" y="104" width="144" height="68" fill="#F08A00" opacity="0.85" />
              <text x="384" y="60" fill="#C9CCCF" fontSize="12" fontFamily="monospace">ŚCIANA ZEWNĘTRZNA</text>
              <text x="384" y="118" fill="#C9CCCF" fontSize="12" fontFamily="monospace">ZBIORNIK WEWNĘTRZNY</text>
              <line x1="372" y1="56" x2="382" y2="56" stroke="#C9CCCF" />
              <line x1="356" y1="114" x2="382" y2="114" stroke="#C9CCCF" />
            </>
          ) : (
            <>
              <rect x="206" y="40" width="148" height="140" rx="8" fill="#2A2624" stroke="#8B9095" strokeWidth="3" />
              <rect x="209" y="100" width="142" height="77" fill="#F08A00" opacity="0.85" />
              <line x1="354" y1="100" x2="382" y2="100" stroke="#C9CCCF" />
              <text x="388" y="104" fill="#C9CCCF" fontSize="12" fontFamily="monospace">POZIOM PALIWA</text>
            </>
          )}
          <rect x="268" y="28" width="24" height="12" fill={RED} />
        </g>
      )}
    </svg>
  );
}
