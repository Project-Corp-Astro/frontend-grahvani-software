"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FileDown, GitCompare, Sparkles, HelpCircle, Clock, MapPin, Calendar } from 'lucide-react';

interface KpDashboardHeaderProps {
    clientName?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    lagna?: string;
    lagnaSign?: string;
    ayanamsaValue?: string;
    moonSign?: string;
    moonNakshatra?: string;
    onGeneratePrediction?: () => void;
    onRunHorary?: () => void;
    onExportReport?: () => void;
    onCompareCharts?: () => void;
    className?: string;
}

/**
 * KP Dashboard Header
 * Shows client info + birth details + quick actions in a compact top bar
 */
export default function KpDashboardHeader({
    clientName = 'Client',
    birthDate,
    birthTime,
    birthPlace,
    lagna,
    lagnaSign,
    ayanamsaValue,
    moonSign,
    moonNakshatra,
    onGeneratePrediction,
    onRunHorary,
    onExportReport,
    onCompareCharts,
    className,
}: KpDashboardHeaderProps) {
    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-4", className)}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Left: Client Info */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-lg font-serif font-bold text-gold-dark">
                            {clientName[0]}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-serif font-bold text-primary leading-tight">
                            {clientName}
                        </h2>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-refined flex-wrap">
                            {birthDate && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {birthDate}
                                </span>
                            )}
                            {birthTime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {birthTime}
                                </span>
                            )}
                            {birthPlace && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {birthPlace}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center: Key KP Indicators */}
                <div className="flex items-center gap-3 flex-wrap">
                    {lagna && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold">Lagna</p>
                            <p className="text-sm font-serif font-bold text-primary">{lagna}</p>
                        </div>
                    )}
                    {moonSign && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold">Moon Sign</p>
                            <p className="text-sm font-serif font-bold text-primary">{moonSign}</p>
                        </div>
                    )}
                    {moonNakshatra && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold">Nakshatra</p>
                            <p className="text-sm font-serif font-bold text-primary">{moonNakshatra}</p>
                        </div>
                    )}
                    {ayanamsaValue && (
                        <div className="px-3 py-1.5 bg-gold-primary/10 border border-gold-primary/30 rounded-lg text-center">
                            <p className="text-[9px] uppercase tracking-widest text-gold-dark font-bold">KP Ayanamsa</p>
                            <p className="text-sm font-sans font-semibold text-gold-dark">{ayanamsaValue}</p>
                        </div>
                    )}
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {onGeneratePrediction && (
                        <button
                            onClick={onGeneratePrediction}
                            className="px-3 py-2 bg-gold-primary text-white rounded-lg text-xs font-semibold hover:bg-gold-dark transition-colors flex items-center gap-1.5"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Predict
                        </button>
                    )}
                    {onRunHorary && (
                        <button
                            onClick={onRunHorary}
                            className="px-3 py-2 bg-softwhite border border-antique text-secondary rounded-lg text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-1.5"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Horary
                        </button>
                    )}
                    {onExportReport && (
                        <button
                            onClick={onExportReport}
                            className="px-3 py-2 bg-softwhite border border-antique text-secondary rounded-lg text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-1.5"
                        >
                            <FileDown className="w-3.5 h-3.5" />
                            Export
                        </button>
                    )}
                    {onCompareCharts && (
                        <button
                            onClick={onCompareCharts}
                            className="px-3 py-2 bg-softwhite border border-antique text-secondary rounded-lg text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-1.5"
                        >
                            <GitCompare className="w-3.5 h-3.5" />
                            Compare
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
