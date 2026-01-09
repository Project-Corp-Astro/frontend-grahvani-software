import React from 'react';
import { Planet } from './NorthIndianChart/NorthIndianChart';
import { cn } from "@/lib/utils";

interface PlanetComparisonTableProps {
    planetsA: Planet[];
    planetsB: Planet[];
    chartAName?: string;
    chartBName?: string;
}

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function PlanetComparisonTable({
    planetsA,
    planetsB,
    chartAName = "Chart A",
    chartBName = "Chart B"
}: PlanetComparisonTableProps) {

    // Sort logic or fixed list of planets can be used. 
    // For now assuming both lists have same planets in same order or needed mapping.
    // Let's create a map of standard planets to ensure order.
    const PLANET_ORDER = ['Asc', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

    const getPlanetData = (list: Planet[], name: string) => list.find(p => p.name === name);

    return (
        <div className="w-full border border-[#DCC9A6] rounded-md overflow-hidden bg-[#FEFAEA]">
            <table className="w-full text-sm font-serif">
                <thead
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                    }}
                    className="border-b border-[#DCC9A6]"
                >
                    <tr>
                        <th className="py-2 px-4 text-left text-[#FEFAEA] uppercase tracking-wider font-bold">Planet</th>
                        <th className="py-2 px-4 text-left text-[#FEFAEA] uppercase tracking-wider font-bold">{chartAName}</th>
                        <th className="py-2 px-4 text-left text-[#FEFAEA] uppercase tracking-wider font-bold">{chartBName}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC9A6]/30">
                    {PLANET_ORDER.map((planetName) => {
                        const pA = getPlanetData(planetsA, planetName);
                        const pB = getPlanetData(planetsB, planetName);

                        if (!pA && !pB) return null;

                        return (
                            <tr key={planetName} className="hover:bg-[#F2DCBC]/20 transition-colors">
                                <td className="py-2 px-4 font-bold text-[#3E2A1F]">{planetName}</td>
                                <td className="py-2 px-4 text-[#5C4033]">
                                    {pA ? (
                                        <span className="flex items-center gap-2">
                                            <span>{ZODIAC_SIGNS[pA.signId - 1]}</span>
                                            <span className="opacity-70 text-xs">({pA.degree})</span>
                                            {pA.isRetro && <span className="text-xs text-red-600 font-bold">(R)</span>}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="py-2 px-4 text-[#5C4033]">
                                    {pB ? (
                                        <span className="flex items-center gap-2">
                                            <span>{ZODIAC_SIGNS[pB.signId - 1]}</span>
                                            <span className="opacity-70 text-xs">({pB.degree})</span>
                                            {pB.isRetro && <span className="text-xs text-red-600 font-bold">(R)</span>}
                                        </span>
                                    ) : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
