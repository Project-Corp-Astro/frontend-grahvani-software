'use client';

import React, { memo } from 'react';
import { LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanetPosition } from '@/types/yoga.types';

interface YogaPlanetsGridProps {
    data: Record<string, PlanetPosition>;
}

/** Planet abbreviation map for compact display */
const PLANET_ABBR: Record<string, string> = {
    Jupiter: 'JU', Mars: 'MA', Moon: 'MO', Sun: 'SU',
    Mercury: 'ME', Venus: 'VE', Saturn: 'SA', Rahu: 'RA', Ketu: 'KE',
};

/** Accent coloring for key planets */
const PLANET_STYLES: Record<string, string> = {
    Jupiter: 'bg-gold-primary text-primary font-bold',
    Moon: 'bg-indigo-500 text-white',
    Sun: 'bg-amber-500 text-white',
    Mars: 'bg-red-500 text-white',
    Rahu: 'bg-zinc-700 text-white',
    Ketu: 'bg-zinc-500 text-white',
};

export const YogaPlanetsGrid = memo(function YogaPlanetsGrid({ data }: YogaPlanetsGridProps) {
    const planetEntries = Object.entries(data);
    if (planetEntries.length === 0) return null;

    return (
        <div className="bg-white border border-antique rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 px-1">
                <LayoutGrid className="w-3.5 h-3.5 text-gold-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary opacity-60">
                    Planetary Positions
                </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {planetEntries.map(([planet, details]) => (
                    <div
                        key={planet}
                        className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-lg p-2 hover:border-gold-primary/30 transition-colors"
                    >
                        <div className={cn(
                            "w-7 h-7 rounded flex items-center justify-center text-[9px] font-black shrink-0",
                            PLANET_STYLES[planet] ?? 'bg-white border border-antique text-primary'
                        )}>
                            {PLANET_ABBR[planet] ?? planet.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col leading-none min-w-0">
                            <span className="text-[10px] font-bold text-primary truncate">{details.sign}</span>
                            <span className="text-[9px] text-primary opacity-60 font-mono">
                                H{details.house}
                                {details.retrograde === 'R' && <span className="text-red-500 ml-0.5">R</span>}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
