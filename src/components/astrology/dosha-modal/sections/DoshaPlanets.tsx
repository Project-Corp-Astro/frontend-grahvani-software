'use client';

import React, { memo } from 'react';
import { LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedDoshaPlanet } from '@/types/dosha.types';

interface DoshaPlanetsProps {
    data: NormalizedDoshaPlanet[];
}

export const DoshaPlanets = memo(function DoshaPlanets({ data }: DoshaPlanetsProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-white border border-antique rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors">
                <LayoutGrid className="w-3.5 h-3.5 text-red-500" /> Chart Foundations
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {data.map((planet, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl p-2.5 transition-all hover:border-red-200 group/planet",
                            planet.isFocal && "bg-red-50/50 border-red-100 ring-1 ring-red-500/10"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-transform group-hover/planet:scale-105",
                            planet.isFocal ? "bg-red-500 text-white shadow-sm" : "bg-white border border-antique text-ink shadow-xs"
                        )}>
                            {planet.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col leading-tight overflow-hidden">
                            <span className="text-[10px] font-black text-ink uppercase tracking-tight truncate">{planet.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-serif italic text-secondary">{planet.sign}</span>
                                <span className="w-1 h-1 bg-antique rounded-full" />
                                <span className="text-[9px] font-mono text-red-600 font-bold">{planet.house}H</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
