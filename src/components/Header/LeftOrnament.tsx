export default function LeftOrnament() {
  return (
    <svg
      viewBox="0 0 400 120"
      className="absolute left-0 top-0 h-full w-[45%] max-w-[500px]"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="leftGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b2e14" />
          <stop offset="40%" stopColor="#8a5a2b" />
          <stop offset="70%" stopColor="#c79a57" />
          <stop offset="100%" stopColor="#f3d7a3" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Main Scroll Shape */}
      <path
        d="
          M400 0
          H90
          C40 0 0 30 0 80
          C0 110 30 120 50 110
          C70 100 60 80 40 80
          C20 80 20 100 40 105
          L80 115
          C150 120 250 80 400 60
          V0
          Z
        "
        fill="url(#leftGold)"
        filter="url(#shadow)"
      />

      {/* Inner Detail Line */}
      <path
        d="
            M400 10
            H100
            C60 10 30 35 30 75
            C30 95 45 100 50 95
        "
        fill="none"
        stroke="#f3d7a3"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}
