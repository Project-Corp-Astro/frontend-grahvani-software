'use client';

import React, { memo } from 'react';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedHeader } from '@/types/yoga.types';

interface YogaHeaderProps {
    data: NormalizedHeader;
}

export const YogaHeader = memo(function YogaHeader({ data }: YogaHeaderProps) {
    const { title, subtitle, isPresent, strength, strengthScore } = data;

    // Strength bar width calculation
    const maxScore = 20;
    const barPercent = strengthScore
        ? Math.min((strengthScore / maxScore) * 100, 100)
        : strength?.includes('Exceptional') ? 100
            : strength?.includes('very_good') ? 85
                : strength?.includes('Strong') || strength?.includes('good') ? 70
                    : 40;

    const strengthLabel = strength
        ?.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <div className="bg-white border border-antique rounded-2xl p-4 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                {/* Left: Icon + Title */}
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isPresent
                            ? "bg-gold-primary/10 text-gold-primary"
                            : "bg-zinc-100 text-zinc-400"
                    )}>
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-primary leading-tight">
                            {title.trim().replace(/\s*yoga$/i, '').trim() || 'Yoga'} <span className="">Yoga</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                                isPresent
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                            )}>
                                {isPresent ? 'Active' : 'Inactive'}
                            </span>
                            {isPresent ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <XCircle className="w-3.5 h-3.5 text-orange-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Strength Indicator */}
                {(strength || strengthScore !== undefined) && isPresent && (
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-primary opacity-70 font-bold mb-1">Strength</p>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold border",
                                barPercent >= 80 ? "bg-amber-600 text-white border-amber-700"
                                    : barPercent >= 60 ? "bg-gold-primary text-primary border-gold-dark"
                                        : "bg-parchment text-primary border-antique"
                            )}>
                                {strengthLabel ?? `${strengthScore} pts`}
                            </span>
                        </div>
                        <div className="w-20 h-1.5 bg-parchment rounded-full overflow-hidden border border-antique/50">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000 rounded-full",
                                    barPercent >= 80 ? "bg-amber-600 shadow-[0_0_6px_rgba(217,119,6,0.4)]"
                                        : barPercent >= 60 ? "bg-gold-primary"
                                            : "bg-gold-primary/50"
                                )}
                                style={{ width: `${barPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Subtitle / Reason */}
            {subtitle && (
                <p className="text-xs text-primary leading-relaxed border-t border-antique/30 pt-3">
                    {subtitle}
                </p>
            )}
        </div>
    );
});
