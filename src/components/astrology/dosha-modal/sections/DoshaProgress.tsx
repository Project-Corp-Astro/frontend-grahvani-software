'use client';

import React, { memo } from 'react';
import { Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DoshaProgressProps {
    data: {
        label: string;
        percentage: number;
        description: string;
    };
}

export const DoshaProgress = memo(function DoshaProgress({ data }: DoshaProgressProps) {
    return (
        <div className="bg-softwhite border border-red-100 rounded-2xl p-6">
            <h3 className="font-serif font-bold text-ink mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Clock className="w-4 h-4 text-red-500" /> Transit Timeline & Phase
            </h3>

            <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-[10px] font-black text-red-900/60 uppercase tracking-tighter block mb-1">Active Phase</span>
                        <h4 className="text-sm font-serif font-bold text-ink">{data.label}</h4>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-black text-red-600 leading-none">{data.percentage}%</span>
                        <span className="text-[8px] block font-black text-red-900/40 uppercase">Completion</span>
                    </div>
                </div>

                {/* Progress Track */}
                <div className="h-2.5 bg-red-50 rounded-full overflow-hidden border border-red-100 shadow-inner p-0.5">
                    <div
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                        style={{ width: `${data.percentage}%` }}
                    />
                </div>

                <div className="p-4 bg-red-50/20 rounded-2xl border border-red-100/50">
                    <h4 className="text-[10px] font-black text-red-900 uppercase mb-2 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" /> Phase Specifics
                    </h4>
                    <p className="text-xs text-secondary leading-relaxed italic">
                        "{data.description}"
                    </p>
                </div>
            </div>
        </div>
    );
});
