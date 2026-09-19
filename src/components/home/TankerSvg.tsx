/**
 * Side profile of the EXOIL tanker combination (tractor + 3-axle tank semi-trailer), facing right.
 * Colours follow the real livery: red cab, white tank, black chassis. No logo is drawn here —
 * the logo only ever appears as the original image file.
 * Coordinate box: 0 0 480 150, ground at y=140.
 */
export function TankerShape({ compartments = 0, x = 0, y = 0 }: { compartments?: number; x?: number; y?: number }) {
  // Compartment fill 0–1 across the 5 compartments (for the loading diagram).
  const bays = [
    [58, 118],
    [118, 170],
    [170, 238],
    [238, 290],
    [290, 352],
  ] as const;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Tank shell */}
      <rect x="40" y="46" width="330" height="62" rx="30" fill="#EDEDEA" stroke="#1F1A17" strokeWidth="2" />
      {compartments > 0 &&
        bays.map(([a, b], i) => {
          const fill = Math.max(0, Math.min(1, compartments * 5 - i));
          const h = 52 * fill;
          return <rect key={i} x={a + 3} y={103 - h} width={b - a - 6} height={h} fill="#F08A00" opacity="0.85" />;
        })}
      {[118, 170, 238, 290].map((bx) => (
        <line key={bx} x1={bx} y1="48" x2={bx} y2="106" stroke="#8B9095" strokeWidth="1.2" />
      ))}
      {/* Top walkway, domes and rail */}
      <rect x="62" y="41" width="286" height="4" fill="#8B9095" />
      {[80, 140, 200, 262, 322].map((dx) => (
        <rect key={dx} x={dx - 9} y="36" width="18" height="6" fill="#8B9095" />
      ))}
      <line x1="66" y1="30" x2="344" y2="30" stroke="#8B9095" strokeWidth="1.5" />
      {Array.from({ length: 8 }, (_, i) => 72 + i * 38).map((px) => (
        <line key={px} x1={px} y1="30" x2={px} y2="41" stroke="#8B9095" strokeWidth="1" />
      ))}
      {/* Sub-frame, cabinet, guard rail, rear bumper */}
      <rect x="46" y="106" width="326" height="7" fill="#1F1A17" />
      <rect x="296" y="108" width="44" height="18" fill="#1F1A17" />
      <line x1="150" y1="124" x2="290" y2="124" stroke="#8B9095" strokeWidth="2.5" />
      <rect x="32" y="112" width="12" height="12" fill="#1F1A17" />
      <rect x="33" y="114" width="4" height="4" fill="#DA251D" />
      {/* Tractor chassis */}
      <rect x="344" y="112" width="110" height="7" fill="#1F1A17" />
      <rect x="388" y="113" width="26" height="12" rx="6" fill="#8B9095" />
      {/* Cab */}
      <path d="M420 120 L420 52 Q420 40 432 40 L462 40 Q471 40 472 50 L476 104 L476 120 Z" fill="#C81D17" stroke="#1F1A17" strokeWidth="2" />
      <path d="M452 48 L466 48 L469 78 L452 78 Z" fill="#1A2228" />
      <rect x="424" y="34" width="44" height="7" rx="2" fill="#C81D17" stroke="#1F1A17" strokeWidth="1.5" />
      <rect x="472" y="106" width="6" height="6" fill="#FFF1D6" />
      <rect x="468" y="112" width="10" height="9" fill="#1F1A17" />
      {/* Wheels */}
      {[88, 118, 148, 380, 452].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy="127" r="13" fill="#141212" />
          <circle cx={wx} cy="127" r="6" fill="#B9BDC0" />
        </g>
      ))}
    </g>
  );
}

export function TankerSvg({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 480 150" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <TankerShape />
    </svg>
  );
}
