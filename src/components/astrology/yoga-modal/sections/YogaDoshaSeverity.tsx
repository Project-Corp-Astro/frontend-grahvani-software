'use client';

import React, { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedDoshaSeverity } from '@/types/yoga.types';

interface YogaDoshaSeverityProps {
    data: NormalizedDoshaSeverity;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-500' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: 'text-amber-500' },
    low: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-400' },
};

export const YogaDoshaSeverity = memo(function YogaDoshaSeverity({ data }: YogaDoshaSeverityProps) {
    const styles = SEVERITY_STYLES[data.level.toLowerCase()] ?? SEVERITY_STYLES.medium;

    return (
        <div className={cn('rounded-2xl border p-4 flex items-start gap-3', styles.bg, styles.border)}>
            <div className={cn('p-1.5 rounded-lg shrink-0 mt-0.5', styles.bg)}>
                <AlertTriangle className={cn('w-4 h-4', styles.icon)} />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn('text-sm font-serif font-bold', styles.text)}>
                        Dosha Severity
                    </h4>
                    <span className={cn(
                        'px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider',
                        styles.bg, styles.text
                    )}>
                        {data.level}
                    </span>
                </div>
                {data.description && (
                    <p className="text-xs text-primary leading-relaxed">{data.description}</p>
                )}
            </div>
        </div>
    );
});
