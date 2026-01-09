export default function CenterOrnament() {
    return (
        <svg
            viewBox="0 0 300 100"
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full z-0"
            preserveAspectRatio="none"
        >
            <defs>
                <radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#f3d7a3" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8a5a2b" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="centerGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c79a57" />
                    <stop offset="50%" stopColor="#8a5a2b" />
                    <stop offset="100%" stopColor="#5b2e14" />
                </linearGradient>
            </defs>

            {/* Central Arch/Sun shape */}
            <path
                d="
          M0 0
          H300
          V20
          Q280 20 270 40
          Q250 80 150 80
          Q50 80 30 40
          Q20 20 0 20
          Z
        "
                fill="url(#centerGold)"
            />

            {/* Decorative rays/sunburst lines */}
            <g stroke="#f3d7a3" strokeWidth="1" opacity="0.6">
                <line x1="150" y1="20" x2="150" y2="70" />
                <line x1="120" y1="25" x2="130" y2="60" />
                <line x1="180" y1="25" x2="170" y2="60" />
                <line x1="90" y1="35" x2="110" y2="50" />
                <line x1="210" y1="35" x2="190" y2="50" />
            </g>
        </svg>
    );
}
