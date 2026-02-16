"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface PriorityAlertProps {
    mahadasha?: string;
    antardasha?: string;
}

export default function PriorityAlert({ mahadasha = "Mercury", antardasha = "Saturn" }: PriorityAlertProps) {
    return (
        <div className="relative group max-w-3xl mx-auto w-full">
            {/* Outer Glowing Border - Adjusted for Parchment/Red Theme */}
            <div className="absolute -inset-1 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" style={{ background: 'linear-gradient(to right, #dc2626, #ea580c)' }} />

            <div className={cn("relative flex items-center p-1 overflow-hidden", styles.glassPanel)}>
                {/* Left Icon Section */}
                <div className="p-3 rounded-xl m-1 flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(to bottom right, #fee2e2, #ffedd5)' }}>
                    <Clock className="w-5 h-5 animate-pulse" style={{ color: '#dc2626' }} />
                </div>

                {/* Content Section */}
                <div className="flex-1 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-black uppercase tracking-tighter text-sm italic" style={{ color: '#b91c1c' }}>Priority Alert:</span>
                        <div className="h-4 w-px mx-1" style={{ backgroundColor: 'var(--border-antique)' }} />
                        <span className="text-[13px] font-bold tracking-wide" style={{ color: 'var(--ink)' }}>
                            Current Dasha Influence | <span style={{ color: '#b91c1c' }}>{mahadasha} Mahadasha</span> & <span style={{ color: '#c2410c' }}>{antardasha} Antardasha</span>
                        </span>
                    </div>

                    {/* Subtle Right element */}
                    <div className="hidden lg:flex gap-1 pr-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: '#fca5a5' }} />
                        ))}
                    </div>
                </div>

                {/* Decorative Slice Effect */}
                <div className="absolute right-0 top-0 bottom-0 w-24 skew-x-[30deg] translate-x-12" style={{ background: 'linear-gradient(to left, rgba(220, 38, 38, 0.05), transparent)' }} />
            </div>
        </div>
    );
}
