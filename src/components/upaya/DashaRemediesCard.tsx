"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Calendar,
    Flame,
    Shield,
    Sparkles,
    Info,
    ArrowRight,
    Star
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface DashaRemedy {
    category: string;
    priority: string;
    mantra?: string;
    deity?: string;
    count?: number;
    day?: string;
    items?: string[];
    yantra?: string;
    rudraksha?: string;
    color?: string;
    suggestions?: string[];
}

interface DashaRemediesCardProps {
    dashaData: {
        current_dasha_lord: string;
        importance: string;
        period: {
            planet: string;
            start_date: string;
            end_date: string;
            duration_years: number;
        };
        remedies: DashaRemedy[];
    };
}

const DashaRemediesCard: React.FC<DashaRemediesCardProps> = ({ dashaData }) => {
    const { period, remedies, current_dasha_lord } = dashaData;

    // Calculate progress
    const start = new Date(period.start_date || "").getTime();
    const end = new Date(period.end_date || "").getTime();
    const now = Date.now();
    const total = end - start;
    const current = now - start;
    const progress = Math.min(Math.max((current / total) * 100, 0), 100);

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'medium': return 'text-indigo-600 bg-indigo-100 border-indigo-200';
            case 'low': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'mantra': return <Flame className="w-4 h-4" />;
            case 'yantra': return <Shield className="w-4 h-4" />;
            case 'lifestyle': case 'dietary': return <Sparkles className="w-4 h-4" />;
            default: return <Star className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("p-6 h-full backdrop-blur-md relative overflow-hidden group flex flex-col", styles.glassPanel)}
        >
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--ink)' }}>Current Mahadasha Phase</h3>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--ink)' }}>{current_dasha_lord}</h2>
                        <span className="text-sm font-bold uppercase tracking-widest">Protocol</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 min-w-[280px]">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span>{new Date(period.start_date).getFullYear()}</span>
                        <span>{Math.round(progress)}% Complete</span>
                        <span>{new Date(period.end_date).getFullYear()}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden border border-antique/30 bg-black/5 relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 relative shadow-sm"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Remedies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                {remedies.map((remedy, idx) => (
                    <motion.div
                        key={idx}
                        className="border p-4 rounded-2xl flex flex-col gap-2 transition-all group overflow-hidden relative"
                        style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'rgba(226, 204, 153, 0.2)' }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-100/50">
                                    {getCategoryIcon(remedy.category)}
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest">{remedy.category}</h3>
                            </div>
                            <span className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                getPriorityColor(remedy.priority)
                            )}>
                                {remedy.priority}
                            </span>
                        </div>

                        <div className="flex-1">
                            {remedy.mantra && (
                                <p className="text-sm font-bold leading-tight italic mb-2 tracking-tight" style={{ color: 'var(--ink)' }}>"{remedy.mantra}"</p>
                            )}
                            {remedy.items && (
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
                                    <span className="text-[9px] uppercase tracking-wider font-black mr-2">Donate:</span> {remedy.items.join(', ')}
                                </p>
                            )}
                            {remedy.suggestions && (
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>{remedy.suggestions[0]}</p>
                            )}
                            {remedy.yantra && (
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
                                    <span className="text-[9px] uppercase tracking-wider font-black mr-2">Worship:</span> {remedy.yantra}
                                </p>
                            )}
                        </div>

                        <div className="mt-2 pt-2 border-t flex items-center justify-between border-antique/20">
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {remedy.deity || (remedy.count ? `${remedy.count.toLocaleString()} Chants` : '') || (remedy.color ? `Color: ${remedy.color}` : 'Standard')}
                            </span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white/50 border border-antique/20 text-antique group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                <ArrowRight className="w-2.5 h-2.5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default DashaRemediesCard;
