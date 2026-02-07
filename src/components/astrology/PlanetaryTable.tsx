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
        <div className={cn("w-full", className)}>
            {/* Header */}
            <div className="flex bg-[#EAD8B1] py-1.5 px-3 border-b border-antique font-sans text-sm font-semibold text-secondary uppercase tracking-wider leading-normal">
                <div className="flex-1 min-w-[80px]">Planet</div>
                <div className="flex-1 min-w-[80px]">Sign</div>
                <div className="flex-1 min-w-[60px]">Deg</div>
                <div className="flex-1 min-w-[100px]">Nakshatra</div>
                <div className="w-[40px] text-center">House</div>
            </div>

            {/* Rows */}
            <div className="bg-transparent">
                {planets.map((p, i) => (
                    <div
                        key={p.planet}
                        className={cn(
                            "flex items-center py-1 px-3 font-sans text-base border-b border-antique/30 last:border-0 hover:bg-gold-primary/5 transition-colors leading-normal",
                            i % 2 === 0 ? "bg-transparent" : "bg-antique/5"
                        )}
                    >
                        {/* Planet Name */}
                        <div className="flex-1 min-w-[80px] font-medium text-primary">
                            {p.planet}
                            {p.isRetro && <span className="ml-0.5 text-red-600 text-xs">(R)</span>}
                        </div>

                        {/* Sign */}
                        <div className="flex-1 min-w-[80px] font-regular text-secondary">
                            {p.sign}
                        </div>

                        {/* Degree */}
                        <div className="flex-1 min-w-[60px] font-regular text-primary tracking-tight">
                            {p.degree}
                        </div>

                        {/* Nakshatra */}
                        <div className="flex-1 min-w-[100px] font-regular text-secondary">
                            {p.nakshatra}
                            {p.nakshatraPart && <span className="text-muted-refined ml-1">- {p.nakshatraPart}</span>}
                        </div>

                        {/* House */}
                        <div className="w-[40px] text-center font-medium text-primary">
                            {p.house}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
