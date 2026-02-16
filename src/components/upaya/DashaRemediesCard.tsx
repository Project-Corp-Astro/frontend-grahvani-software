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
            className={cn("p-6 h-full backdrop-blur-md relative overflow-hidden group", styles.glassPanel)}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Current Mahadasha Phase</h3>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--ink)' }}>
                        {current_dasha_lord} <span style={{ color: 'var(--border-divider)' }}>|</span>
                        <span className="text-xl font-medium" style={{ color: 'var(--text-body)' }}>Progress</span>
                    </h2>
                </div>

                <div className="flex flex-col gap-2 min-w-[300px]">
                    <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <span>{new Date(period.start_date).toLocaleDateString()}</span>
                        <span>{Math.round(progress)}% Complete</span>
                        <span>{new Date(period.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden border" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderColor: 'var(--border-antique)' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 relative shadow-sm"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Remedies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remedies.map((remedy, idx) => (
                    <motion.div
                        key={idx}
                        className="border p-5 rounded-2xl flex flex-col gap-3 transition-all group overflow-hidden relative"
                        style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#4F46E5' }}>
                                    {getCategoryIcon(remedy.category)}
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{remedy.category}</h3>
                            </div>
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                                getPriorityColor(remedy.priority)
                            )}>
                                {remedy.priority}
                            </span>
                        </div>

                        <div className="flex-1">
                            {remedy.mantra && (
                                <p className="text-sm font-medium leading-relaxed italic mb-2" style={{ color: 'var(--ink)' }}>"{remedy.mantra}"</p>
                            )}
                            {remedy.items && (
                                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}><span className="text-xs uppercase tracking-wider font-bold mr-2" style={{ color: 'var(--text-muted)' }}>Donate:</span> {remedy.items.join(', ')}</p>
                            )}
                            {remedy.suggestions && (
                                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{remedy.suggestions[0]}</p>
                            )}
                            {remedy.yantra && (
                                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}><span className="text-xs uppercase tracking-wider font-bold mr-2" style={{ color: 'var(--text-muted)' }}>Worship:</span> {remedy.yantra}</p>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-divider)' }}>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                {remedy.deity || (remedy.count ? `${remedy.count.toLocaleString()} Chants` : '') || (remedy.color ? `Color: ${remedy.color}` : 'General')}
                            </span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgb(248 250 252)', color: 'var(--text-muted)' }}>
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default DashaRemediesCard;
