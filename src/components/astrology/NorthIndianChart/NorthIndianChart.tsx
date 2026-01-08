import React from 'react';

export default function NorthIndianChart() {
    // North Indian Style (Diamond Chart)
    // Signs are MUTABLE (Houses are fixed).
    // House 1 is always Top Diamond.
    // Count proceeds anti-clockwise usually.

    // MOCK DATA for Signs in Houses (Ascendant = Leo = 5)
    // House 1: 5 (Leo)
    // House 2: 6
    // House 3: 7
    // ...
    // House 12: 4

    const ascendantSign = 5;

    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1; // 1 to 12
        const signNum = ((ascendantSign + i - 1) % 12) || 12;
        return { house: houseNum, sign: signNum };
    });

    // Positions for Labels in the diamond grid (approximate centers of houses)
    // Viewbox 400x400
    // H1 (Top Center)
    const houseCenters = [
        { h: 1, x: 200, y: 100 }, // Top Diamond
        { h: 2, x: 100, y: 50 },  // Top Left Triangle
        { h: 3, x: 50, y: 100 },  // Left Triangle
        { h: 4, x: 100, y: 200 }, // Center Left Diamond
        { h: 5, x: 50, y: 300 },  // Bottom Left Triangle
        { h: 6, x: 100, y: 350 }, // Bottom Left Triangle (Lower)
        { h: 7, x: 200, y: 300 }, // Bottom Diamond
        { h: 8, x: 300, y: 350 }, // Bottom Right Triangle (Lower)
        { h: 9, x: 350, y: 300 }, // Bottom Right Triangle
        { h: 10, x: 300, y: 200 },// Center Right Diamond
        { h: 11, x: 350, y: 100 },// Right Triangle
        { h: 12, x: 300, y: 50 }, // Top Right Triangle
    ];

    // MOCK PLANETS (Same as South to show consistency)
    const planets = [
        { name: 'Ju', signId: 4, degree: '12°' }, // Jupiter in Cancer
        { name: 'Su', signId: 5, degree: '05°' }, // Sun in Leo
        { name: 'Ma', signId: 5, degree: '22°' }, // Mars in Leo
        { name: 'Ve', signId: 6, degree: '18°' }, // Venus in Virgo
        { name: 'Me', signId: 6, degree: '02°' }, // Mercury in Virgo
        { name: 'Ra', signId: 8, degree: '15°' }, // Rahu in Scorpio
        { name: 'Ke', signId: 2, degree: '15°' }, // Ketu in Taurus
        { name: 'Sa', signId: 11, degree: '29°' }, // Saturn in Aquarius
        { name: 'Mo', signId: 5, degree: '10°' }, // Moon in Leo
        { name: 'Asc', signId: 4, degree: '14°' }, // Ascendant (Matches Ju sign here just mock)
    ];
    // Wait, in previous component Asc was 4 (Cancer). So Ascendant Sign is 4.
    // If Asc sign is 4, then House 1 = 4.
    // Let's recalculate signs based on Asc = 4.
    const ascSign = 4;
    const houseData = houses.map(h => ({
        ...h,
        sign: ((ascSign + h.house - 1 - 1) % 12) + 1 // 1-based math is annoying
        // ((4 + 0) % 12) = 4. Correct.
    }));


    return (
        <svg viewBox="0 0 400 400" className="w-full h-full border-2 border-[#3E2A1F] bg-[#FEFAEA]">

            {/* Outline Box */}
            <rect x="0" y="0" width="400" height="400" fill="none" stroke="#3E2A1F" strokeWidth="2" />

            {/* Cross Lines (X) */}
            <line x1="0" y1="0" x2="400" y2="400" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="400" y1="0" x2="0" y2="400" stroke="#3E2A1F" strokeWidth="2" />

            {/* Diamond Lines (Connect Midpoints) */}
            <line x1="200" y1="0" x2="0" y2="200" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="0" y1="200" x2="200" y2="400" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="200" y1="400" x2="400" y2="200" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="400" y1="200" x2="200" y2="0" stroke="#3E2A1F" strokeWidth="2" />

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                // Find sign for this house
                // houseData is fixed length 12
                const signId = ((ascSign + pos.h - 2) % 12) + 1; // Correct 1-based sign calc

                const boxPlanets = planets.filter(p => p.signId === signId);

                return (
                    <g key={pos.h}>
                        {/* House Number (small, faint) - Optional, maybe show Sign Number instead */}
                        {/* In North Chart, Sign Number is usually shown in corners of house */}

                        <text
                            x={pos.x}
                            y={pos.y + (pos.h === 1 || pos.h === 4 || pos.h === 7 || pos.h === 10 ? 35 : pos.h === 2 || pos.h === 12 ? 20 : -20)}
                            // Adjust Y based on shape of house to put sign number near a corner or center
                            // Just putting sign number in center with faint color for now
                            fontSize="24"
                            fontFamily="serif"
                            fontWeight="bold"
                            fill="#E7D6B8"
                            textAnchor="middle"
                            dominantBaseline="central"
                            opacity="0.8"
                        >
                            {signId}
                        </text>

                        {/* Planets List */}
                        {boxPlanets.map((p, i) => {
                            // layout offset
                            const yOffset = (i * 14) - ((boxPlanets.length - 1) * 7);
                            return (
                                <text
                                    key={p.name}
                                    x={pos.x}
                                    y={pos.y + yOffset}
                                    fontSize="12"
                                    fontFamily="serif"
                                    fontWeight="bold"
                                    fill="#3E2A1F"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {p.name}
                                </text>
                            );
                        })}
                    </g>
                );
            })}

        </svg>
    );
}
