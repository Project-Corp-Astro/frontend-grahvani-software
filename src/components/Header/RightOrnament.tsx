export default function RightOrnament() {
    return (
        <svg
            viewBox="0 0 400 120"
            className="absolute right-0 top-0 h-full w-[45%] max-w-[500px]"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="rightGold" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#5b2e14" />
                    <stop offset="40%" stopColor="#8a5a2b" />
                    <stop offset="70%" stopColor="#c79a57" />
                    <stop offset="100%" stopColor="#f3d7a3" />
                </linearGradient>
                <filter id="shadowRight">
                    <feDropShadow dx="-2" dy="2" stdDeviation="2" floodOpacity="0.5" />
                </filter>
            </defs>

            {/* Main Scroll Shape - Mirrored */}
            <path
                d="
          M0 0
          H310
          C360 0 400 30 400 80
          C400 110 370 120 350 110
          C330 100 340 80 360 80
          C380 80 380 100 360 105
          L320 115
          C250 120 150 80 0 60
          V0
          Z
        "
                fill="url(#rightGold)"
                filter="url(#shadowRight)"
            />

            {/* Inner Detail Line */}
            <path
                d="
            M0 10
            H300
            C340 10 370 35 370 75
            C370 95 355 100 350 95
        "
                fill="none"
                stroke="#f3d7a3"
                strokeWidth="1"
                opacity="0.4"
            />
        </svg>
    );
}
