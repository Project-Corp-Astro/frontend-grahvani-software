'use client';

import React, { memo } from 'react';
import { Shield, Calendar, User, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedDoshaHeader, NormalizedDoshaMeta } from '@/types/dosha.types';

interface DoshaHeaderProps {
    data: NormalizedDoshaHeader;
    meta: NormalizedDoshaMeta | null;
}

export const DoshaHeader = memo(function DoshaHeader({ data, meta }: DoshaHeaderProps) {
    return (
        <div className="bg-white border border-red-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full -mr-20 -mt-20 blur-3xl transition-opacity group-hover:opacity-20" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                {/* 1. Brand & Title */}
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                        data.isPresent
                            ? "bg-red-100 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                            : "bg-parchment text-secondary"
                    )}>
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black text-ink tracking-tight flex items-center gap-2">
                            {data.title}
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                data.isPresent
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-parchment text-secondary border-antique"
                            )}>
                                {data.strengthBadge}
                            </span>
                        </h2>
                        <p className="text-sm text-secondary font-medium italic mt-0.5">
                            {data.subtitle}
                        </p>
                    </div>
                </div>

                {/* 2. Compact Identity Strip */}
                {meta && (
                    <div className="flex items-center gap-4 text-[10px] bg-parchment/30 px-4 py-2 rounded-xl border border-antique/50">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-secondary" />
                            <span className="font-bold text-ink">{meta.userName}</span>
                        </div>
                        <div className="w-px h-3 bg-antique/50" />
                        <div className="flex items-center gap-1.5 text-secondary">
                            <Calendar className="w-3 h-3" /> {meta.date}
                        </div>
                        <div className="w-px h-3 bg-antique/50" />
                        <div className="flex items-center gap-1.5 text-secondary">
                            <Compass className="w-3 h-3 text-red-600" />
                            <span className="font-serif font-bold">{meta.ascendantSign}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
