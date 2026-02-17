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
        <div className={cn("p-6 h-full relative overflow-hidden flex flex-col", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-purple-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ink)' }}>Sacred Timing Analysis</h3>
            </div>

            <div className="space-y-4 flex-1">
                {/* Hora Section */}
                <div className="border rounded-2xl p-4 relative overflow-hidden group transition-all hover:bg-white/40" style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'var(--border-antique)' }}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100/50">
                                {hora.is_day ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink)' }}>Current Hora</h3>
                                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{hora.hora_lord} Lord</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest bg-orange-50/50 border-orange-100 text-orange-700">
                            #{hora.hora_number}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 flex-1 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(hora.hora_number / 24) * 100}%` }}
                                className="h-full bg-orange-400"
                            />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Day Cycle</span>
                    </div>
                </div>

                {/* Rahu Kaal Section */}
                <div className={cn(
                    "rounded-2xl p-4 border relative overflow-hidden transition-all",
                    isRahuKaalActive
                        ? "bg-rose-50/30 border-rose-200/50"
                        : "bg-white/30 border-antique/30"
                )}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg border", isRahuKaalActive ? "bg-rose-100/50 text-rose-600 border-rose-200" : "bg-slate-100/50 text-slate-500 border-slate-200")}>
                                <AlertOctagon className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink)' }}>Rahu Kaal</h3>
                                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{rahu_kaal.duration_minutes} Minutes</p>
                            </div>
                        </div>
                        {isRahuKaalActive && (
                            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse mt-1" />
                        )}
                    </div>
                    <p className={cn(
                        "text-[10px] font-semibold leading-relaxed p-2.5 rounded-xl border",
                        isRahuKaalActive
                            ? "bg-rose-50/50 border-rose-100 text-rose-700"
                            : "bg-white/40 border-[#E7D6B8] text-[var(--text-body)]"
                    )}>
                        {rahu_kaal.recommendation}
                    </p>
                </div>

                {/* Tithi Section */}
                <div className="border rounded-2xl p-4 relative overflow-hidden group transition-all hover:bg-white/40" style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'var(--border-antique)' }}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink)' }}>Lunar Tithi</h3>
                                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{tithi.name}</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest bg-indigo-50/50 border-indigo-100 text-indigo-700">
                            {tithi.paksha}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {tithi.is_amavasya && <span className="text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest bg-slate-900 text-slate-100 border-slate-700">Amavasya</span>}
                        {tithi.is_purnima && <span className="text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest bg-amber-500 text-white border-amber-600">Purnima</span>}
                        {tithi.is_ekadashi && <span className="text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest bg-purple-600 text-white border-purple-700">Ekadashi</span>}
                        {!tithi.is_amavasya && !tithi.is_purnima && !tithi.is_ekadashi && (
                            <span className="text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest bg-white/50 text-indigo-600 border-indigo-100">Standard Phase</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Aesthetic Detail */}
            <div className="mt-6 pt-4 border-t border-antique/20 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Panchanga Metrics</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
        </div>
    );
};

export default MantraTimingCard;

