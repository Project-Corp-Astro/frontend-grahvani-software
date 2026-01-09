import React from 'react';
import { cn } from "@/lib/utils";

export interface PlanetaryInfo {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    nakshatraPart?: number;
    house: number;
    isRetro?: boolean;
}

interface PlanetaryTableProps {
    planets: PlanetaryInfo[];
    className?: string;
}

export default function PlanetaryTable({ planets, className }: PlanetaryTableProps) {
    return (
        <div className={cn("w-full overflow-hidden rounded-lg border border-[#E7D6B8]", className)}>
            {/* Header */}
            <div
                className="flex text-[#FEFAEA] py-3 px-4 uppercase tracking-wider text-xs font-bold font-serif"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                }}
            >
                <div className="flex-1 min-w-[100px]">Planet</div>
                <div className="flex-1 min-w-[100px]">Sign</div>
                <div className="flex-1 min-w-[80px]">Deg</div>
                <div className="flex-1 min-w-[120px]">Nakshatra</div>
                <div className="w-[60px] text-center">House</div>
            </div>

            {/* Rows */}
            <div className="bg-[#FEFAEA]">
                {planets.map((p, i) => (
                    <div
                        key={p.planet}
                        className={cn(
                            "flex items-center py-2 px-4 text-sm font-serif border-b border-[#E7D6B8] last:border-0 hover:bg-[#F2DCBC]/30 transition-colors",
                            i % 2 === 0 ? "bg-white/50" : "bg-transparent"
                        )}
                    >
                        {/* Planet Name */}
                        <div className="flex-1 min-w-[100px] font-semibold text-[#3E2A1F]">
                            {p.planet}
                            {p.isRetro && <span className="ml-1 text-red-600 text-xs">(R)</span>}
                        </div>

                        {/* Sign */}
                        <div className="flex-1 min-w-[100px] text-[#5A3E2B]">
                            {p.sign}
                        </div>

                        {/* Degree */}
                        <div className="flex-1 min-w-[80px] text-[#7A5A43] font-mono text-xs">
                            {p.degree}
                        </div>

                        {/* Nakshatra */}
                        <div className="flex-1 min-w-[120px] text-[#5A3E2B]">
                            {p.nakshatra}
                            {p.nakshatraPart && <span className="text-[#9C7A2F] ml-1">- {p.nakshatraPart}</span>}
                        </div>

                        {/* House */}
                        <div className="w-[60px] text-center font-bold text-[#3E2A1F]">
                            {p.house}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
