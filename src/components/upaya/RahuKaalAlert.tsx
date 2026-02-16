"use client";

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface RahuKaalAlertProps {
    isActive?: boolean;
    recommendedAction?: string;
}

export default function RahuKaalAlert({ isActive = true, recommendedAction = "Focus on Saturn Mantra Practice Now" }: RahuKaalAlertProps) {
    if (!isActive) return null;

    return (
        <div className="w-full rounded-2xl px-6 py-3 flex items-center justify-between backdrop-blur-md shadow-sm" style={{ backgroundColor: 'rgba(255, 247, 237, 0.8)', borderColor: 'rgba(251, 146, 60, 0.3)', border: '1px solid rgba(251, 146, 60, 0.3)' }}>
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: 'rgba(255, 237, 213, 1)', color: '#ea580c' }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: '#c2410c' }}>Rahu Kaal Active.</span>
                    <span className="text-xs" style={{ color: '#431407' }}>Recommended Action: {recommendedAction}</span>
                </div>
            </div>

            <button className="flex items-center gap-1.5 transition-colors group" style={{ color: '#c2410c' }}>
                <span className="text-[11px] font-bold uppercase tracking-widest border-b" style={{ borderColor: 'rgba(234, 88, 12, 0.5)' }}>Practice Now</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
