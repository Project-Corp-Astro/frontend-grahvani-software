'use client';

import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedDoshaTechnical } from '@/types/dosha.types';

interface DoshaTechnicalProps {
    data: NormalizedDoshaTechnical;
}

export const DoshaTechnical = memo(function DoshaTechnical({ data }: DoshaTechnicalProps) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-5 text-zinc-300 flex flex-col border border-zinc-800 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-20" />

            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Calculation Engine
            </h3>

            {/* Critical Fixes / Notes */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar mb-4">
                {data.fixes && data.fixes.length > 0 ? data.fixes.map((fix: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start group/fix">
                        <span className="text-[9px] font-mono text-zinc-600 mt-0.5 group-hover/fix:text-red-400 transition-colors">0{i + 1}</span>
                        <p className="text-[10px] leading-tight group-hover/fix:text-zinc-100 transition-colors text-zinc-400">
                            {fix}
                        </p>
                    </div>
                )) : (
                    <p className="text-[10px] italic text-zinc-600">Standard mathematical parameters applied.</p>
                )}
            </div>

            {/* Grid Stats */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                    <span className="block text-[8px] text-zinc-500 uppercase font-black tracking-tighter mb-0.5">Ayanamsa</span>
                    <span className="text-[10px] font-mono text-red-400 font-bold">{data.ayanamsa}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                    <span className="block text-[8px] text-zinc-500 uppercase font-black tracking-tighter mb-0.5">House System</span>
                    <span className="text-[10px] font-serif text-white">{data.houseSystem}</span>
                </div>
            </div>
        </div>
    );
});
