"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpRulingPlanetsResponse } from '@/types/kp.types';
import { RefreshCw, Clock, Sun, Moon, Star, Compass } from 'lucide-react';

interface RulingPlanetsWidgetProps {
    data: KpRulingPlanetsResponse['data'] | null;
    isLoading?: boolean;
    onRefresh?: () => void;
    calculatedAt?: string;
    className?: string;
}

/**
 * Ruling Planets Widget
 * Displays current ruling planets for timing analysis
 * Time-sensitive data with refresh capability
 */
export default function RulingPlanetsWidget({
    data,
    isLoading,
    onRefresh,
    calculatedAt,
    className,
}: RulingPlanetsWidgetProps) {
    const formatTime = (isoString?: string) => {
        if (!isoString) return '';
        try {
            return new Date(isoString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    if (!data && !isLoading) {
        return (
            <div className="text-center py-8 text-muted text-sm">
                No ruling planets data available
            </div>
        );
    }

    return (
        <div className={cn("bg-gradient-to-br from-copper-900 to-copper-800 rounded-2xl p-6 text-white", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif font-bold text-xl text-amber-100">Ruling Planets</h3>
                    <p className="text-[10px] text-copper-300 uppercase tracking-widest mt-1">
                        Current Timing Analysis
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {calculatedAt && (
                        <span className="flex items-center gap-1 text-[10px] text-copper-300">
                            <Clock className="w-3 h-3" />
                            {formatTime(calculatedAt)}
                        </span>
                    )}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className={cn(
                                "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors",
                                isLoading && "animate-spin"
                            )}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-gold-primary" />
                </div>
            ) : data && (
                <div className="space-y-4">
                    {/* Day Lord */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Sun className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-copper-300 uppercase tracking-wider">Day Lord</p>
                            <p className="font-serif font-bold text-lg text-amber-100">{data.dayLord}</p>
                        </div>
                    </div>

                    {/* Moon Rulers */}
                    <div className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Moon className="w-4 h-4 text-blue-300" />
                            <span className="text-xs text-copper-300 uppercase tracking-wider">Moon Position</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Sign Lord</p>
                                <p className="font-serif font-bold text-amber-200">{data.moonSignLord}</p>
                            </div>
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Star Lord</p>
                                <p className="font-serif font-bold text-gold-primary">{data.moonStarLord}</p>
                            </div>
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Sub Lord</p>
                                <p className="font-serif font-bold text-amber-300">{data.moonSubLord}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lagna Rulers */}
                    <div className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Compass className="w-4 h-4 text-green-300" />
                            <span className="text-xs text-copper-300 uppercase tracking-wider">Lagna Position</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Sign Lord</p>
                                <p className="font-serif font-bold text-amber-200">{data.lagnaSignLord}</p>
                            </div>
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Star Lord</p>
                                <p className="font-serif font-bold text-gold-primary">{data.lagnaStarLord}</p>
                            </div>
                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                <p className="text-[9px] text-copper-400 uppercase">Sub Lord</p>
                                <p className="font-serif font-bold text-amber-300">{data.lagnaSubLord}</p>
                            </div>
                        </div>
                    </div>

                    {/* Common Ruling Planets */}
                    {data.rulingPlanets && data.rulingPlanets.length > 0 && (
                        <div className="p-4 bg-gold-primary/10 rounded-xl border border-gold-primary/30">
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-gold-primary" />
                                <span className="text-xs text-gold-primary uppercase tracking-wider font-semibold">
                                    Common Rulers (For Timing)
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.rulingPlanets.map((rp, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gold-primary/20 text-gold-primary rounded-full text-sm font-semibold"
                                    >
                                        {rp.planet}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
