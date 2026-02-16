"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sun,
    Moon,
    Clock,
    AlertOctagon,
    Calendar,
    Sparkles,
    Hourglass
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface TimingData {
    hora: {
        is_day: boolean;
        day_lord: string;
        hora_lord: string;
        hora_number: number;
    };
    rahu_kaal: {
        duration_minutes: number;
        recommendation: string;
    };
    tithi: {
        name: string;
        number: number;
        paksha: string;
        is_purnima: boolean;
        is_amavasya: boolean;
        is_ekadashi: boolean;
    };
}

interface MantraTimingCardProps {
    timing: TimingData;
}

const MantraTimingCard: React.FC<MantraTimingCardProps> = ({ timing }) => {
    const { hora, rahu_kaal, tithi } = timing;

    const isRahuKaalActive = rahu_kaal.recommendation.toLowerCase().includes("avoid");

    return (
        <div className={cn("p-6 h-full relative overflow-hidden", styles.glassPanel)}>
            <h3 className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>Sacred Timings (Panchang)</h3>

            <div className="space-y-4">
                {/* Hora Section */}
                <div className="border rounded-2xl p-4 relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', color: 'var(--gold-dark)' }}>
                                {hora.is_day ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>Hora</h3>
                                <p className="text-[10px] font-medium" style={{ color: 'var(--text-body)' }}>Current Planetary Hour</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: 'rgba(201, 162, 77, 0.2)', color: 'var(--gold-dark)' }}>
                            #{hora.hora_number}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg border mt-2" style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'var(--border-antique)' }}>
                        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Lord</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--gold-dark)' }}>{hora.hora_lord}</span>
                    </div>
                </div>

                {/* Rahu Kaal Section */}
                <div className={cn(
                    "rounded-2xl p-4 border relative overflow-hidden transition-all",
                    isRahuKaalActive
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-[rgba(255,255,255,0.4)] border-[#E7D6B8]"
                )}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", isRahuKaalActive ? "bg-rose-100/50 text-rose-600" : "bg-slate-100/50 text-slate-500")}>
                                <AlertOctagon className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>Rahu Kaal</h3>
                                <p className="text-[10px] font-medium" style={{ color: 'var(--text-body)' }}>{rahu_kaal.duration_minutes} mins</p>
                            </div>
                        </div>
                        {isRahuKaalActive && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                    </div>
                    <p className={cn(
                        "text-[10px] font-medium leading-relaxed p-2 rounded-lg border mt-2",
                        isRahuKaalActive
                            ? "bg-rose-50 border-rose-100 text-rose-700"
                            : "bg-white/40 border-[#E7D6B8] text-[var(--text-body)]"
                    )}>
                        {rahu_kaal.recommendation}
                    </p>
                </div>
            </div>

            {/* Tithi Section */}
            <div className="border rounded-2xl p-4 relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>Tithi</h3>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-body)' }}>{tithi.name}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{tithi.paksha}</span>
                    <div className="flex gap-1">
                        {tithi.is_amavasya && <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase" style={{ backgroundColor: '#1e293b', color: '#cbd5e1', borderColor: '#334155' }}>Amavasya</span>}
                        {tithi.is_purnima && <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#d97706', borderColor: 'rgba(245, 158, 11, 0.3)' }}>Purnima</span>}
                        {tithi.is_ekadashi && <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', color: '#9333ea', borderColor: 'rgba(147, 51, 234, 0.2)' }}>Ekadashi</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MantraTimingCard;

