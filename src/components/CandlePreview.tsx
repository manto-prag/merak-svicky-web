type Props = {
  hex: string;
  vesselStyle?: string;
  label?: string;
  sublabel?: string;
  className?: string;
};

/** Lightweight SVG preview of the configured candle. */
export function CandlePreview({ hex, vesselStyle = "glass", label, sublabel, className }: Props) {
  const isTin = vesselStyle === "tin";
  const isCeramic = vesselStyle === "ceramic";
  const radius = isTin ? 6 : isCeramic ? 26 : 14;

  return (
    <div className={className}>
      <svg viewBox="0 0 220 260" className="w-full" role="img" aria-label={label ?? "Candle preview"}>
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,214,150,0.85)" />
            <stop offset="100%" stopColor="rgba(255,214,150,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="110" cy="243" rx="72" ry="10" fill="rgba(0,0,0,0.07)" />
        <circle cx="110" cy="96" r="58" fill="url(#glow)" />

        <g className="candle-flame">
          <path d="M110 62c9 12 13 19 13 27a13 13 0 0 1-26 0c0-8 4-15 13-27Z" fill="#f8c471" />
          <path d="M110 76c4.5 6.5 6.5 10 6.5 14a6.5 6.5 0 0 1-13 0c0-4 2-7.5 6.5-14Z" fill="#fff3d6" />
        </g>
        <rect x="108.5" y="98" width="3" height="16" rx="1.5" fill="#5b4636" />

        <rect x="52" y="112" width="116" height="118" rx={radius} fill={hex} />
        <rect x="52" y="112" width="116" height="118" rx={radius} fill="url(#glass)" />
        <ellipse cx="110" cy="114" rx="58" ry="9" fill={hex} />
        <ellipse cx="110" cy="114" rx="58" ry="9" fill="rgba(255,255,255,0.25)" />
        {isTin && <rect x="52" y="112" width="116" height="10" fill="rgba(255,255,255,0.35)" />}
        {isCeramic && <rect x="52" y="196" width="116" height="1.5" fill="rgba(255,255,255,0.4)" />}
      </svg>

      {(label || sublabel) && (
        <div className="mt-2 text-center">
          {label && <p className="font-display text-xl">{label}</p>}
          {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
