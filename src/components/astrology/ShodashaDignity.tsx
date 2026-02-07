"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Sparkles, Award, Info, Zap } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartEntry {
    chartType: string;
    ayanamsa?: string;
    system?: string;
    chartConfig?: {
        ayanamsa?: string;
        system?: string;
    };
    chartData?: Record<string, unknown>;
}

interface DignityMatrixProps {
    data: {
        charts?: ChartEntry[];
    };
    activeSystem?: string; // Optional: filter by specific ayanamsa
    className?: string;
}

// Helper to extract sign for a planet from various chart structures
const extractPlanetSign = (chartData: Record<string, unknown> | undefined, planet: string): string => {
    if (!chartData) return "";

    const fullName = PLANET_MAP[planet]?.full;

    // 1. Direct key lookups (standard in summary charts)
    // Try abbreviation (Su) then Full Name (Sun)
    const directData = (chartData[planet] || (fullName ? chartData[fullName] : null));
    if (typeof directData === 'string') return directData;
    if (directData && typeof directData === 'object') {
        const d = directData as Record<string, unknown>;
        const sign = d.sign || d.sign_name || d.signName || d.current_sign;
        if (typeof sign === 'string') return sign;
    }

    // 2. Nested in planetary_positions (standard in varga charts)
    const positions = (chartData.planetary_positions || chartData.transit_positions || chartData.planets) as Record<string, unknown> | null;
    if (positions) {
        const pos = (positions[planet] || (fullName ? positions[fullName] : null)) as Record<string, unknown> | null;
        if (pos) {
            const sign = pos.sign || pos.sign_name || pos.signName || (typeof pos === 'string' ? pos : "");
            if (typeof sign === 'string') return sign;
        }
    }

    // 3. Array format check
    const dataArray = Array.isArray(chartData.planets) ? chartData.planets :
        Array.isArray(chartData.planetary_positions) ? chartData.planetary_positions : null;
    if (dataArray) {
        const found = dataArray.find((item: any) =>
            item.name === planet || item.planet === planet ||
            (fullName && (item.name === fullName || item.planet === fullName))
        );
        if (found) {
            const sign = found.sign || found.sign_name || found.signName;
            if (typeof sign === 'string') return sign;
        }
    }

    return "";
};

const VARGAS = [
    { id: 'D1', weight: 6, label: 'Rashi', description: 'General destiny and physical body' },
    { id: 'D2', weight: 2, label: 'Hora', description: 'Wealth, prosperity and family' },
    { id: 'D3', weight: 4, label: 'Drekkana', description: 'Siblings, courage and enterprise' },
    { id: 'D7', weight: 5, label: 'Saptamsha', description: 'Children and grandchildren' },
    { id: 'D9', weight: 5, label: 'Navamsha', description: 'Marriage, strength and internal soul' },
    { id: 'D10', weight: 4, label: 'Dashamsha', description: 'Profession, success and public image' },
    { id: 'D12', weight: 4, label: 'Dwadashamsha', description: 'Parents and lineage' },
    { id: 'D16', weight: 2, label: 'Shodashamsha', description: 'Conveyances, comforts and luxuries' },
    { id: 'D30', weight: 2, label: 'Trimshamsha', description: 'Misfortunes, health and enemies' },
    { id: 'D60', weight: 5, label: 'Shashtiamsha', description: 'Past life karma and detailed analysis' },
];

const PLANET_MAP: Record<string, { full: string, short: string }> = {
    'Su': { full: 'Sun', short: 'Su' },
    'Mo': { full: 'Moon', short: 'Mo' },
    'Ma': { full: 'Mars', short: 'Ma' },
    'Me': { full: 'Mercury', short: 'Me' },
    'Ju': { full: 'Jupiter', short: 'Ju' },
    'Ve': { full: 'Venus', short: 'Ve' },
    'Sa': { full: 'Saturn', short: 'Sa' },
    'Ra': { full: 'Rahu', short: 'Ra' },
    'Ke': { full: 'Ketu', short: 'Ke' },
};

const PLANETS = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

export default function ShodashaDignity({ data, activeSystem, className }: DignityMatrixProps) {

    // Enhanced dignity detection logic
    const getDignityDetails = (planetAbbr: string, sign: string) => {
        if (!sign) return null;

        const planet = PLANET_MAP[planetAbbr]?.full || planetAbbr;

        const ucha: Record<string, string> = { 'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn', 'Mercury': 'Virgo', 'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra' };
        const neecha: Record<string, string> = { 'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer', 'Mercury': 'Pisces', 'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries' };
        const swakshetra: Record<string, string[]> = {
            'Sun': ['Leo'], 'Moon': ['Cancer'], 'Mars': ['Aries', 'Scorpio'], 'Mercury': ['Gemini', 'Virgo'],
            'Jupiter': ['Sagittarius', 'Pisces'], 'Venus': ['Taurus', 'Libra'], 'Saturn': ['Capricorn', 'Aquarius']
        };

        const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

        if (ucha[planet] === normalizedSign) return { label: 'Ucha', category: 'exalted', color: 'text-emerald-600 border-emerald-200 bg-emerald-50/50' };
        if (neecha[planet] === normalizedSign) return { label: 'Neecha', category: 'debilitated', color: 'text-rose-600 border-rose-200 bg-rose-50/50' };
        if (swakshetra[planet]?.includes(normalizedSign)) return { label: 'Swa', category: 'own', color: 'text-indigo-600 border-indigo-200 bg-indigo-50/50' };

        return { label: normalizedSign.substring(0, 3), category: 'neutral', color: 'text-slate-500 border-slate-100 bg-slate-50/30' };
    };

    // Robust Data Normalization
    const normalizedData = useMemo(() => {
        const matrix: Record<string, Record<string, string>> = {};
        const scores: Record<string, number> = {};

        // Filter charts by active system if provided
        const filteredCharts = activeSystem
            ? data?.charts?.filter(c => {
                const chartAyanamsa = (c.ayanamsa || c.chartConfig?.ayanamsa || c.system || c.chartConfig?.system || 'lahiri').toLowerCase();
                return chartAyanamsa === activeSystem.toLowerCase();
            }) || []
            : data?.charts || [];

        // 1. Try to find consolidated summary first
        const summaryChart = filteredCharts.find((c: ChartEntry) =>
            c.chartType === 'shodasha_varga_signs' || c.chartType === 'shodasha_varga_summary'
        );

        if (summaryChart?.chartData) {
            const chartData = summaryChart.chartData as Record<string, unknown>;
            PLANETS.forEach(p => {
                matrix[p] = {};
                VARGAS.forEach(v => {
                    const fullName = PLANET_MAP[p]?.full;

                    // Try nested structure (Su: { D1: "Ari" })
                    const planetData = (chartData[p] || (fullName ? chartData[fullName] : null)) as Record<string, string> | null;
                    if (planetData && typeof planetData === 'object' && planetData[v.id]) {
                        matrix[p][v.id] = planetData[v.id];
                    }

                    // Try inverted structure (D1: { Su: "Ari" })
                    if (!matrix[p][v.id]) {
                        const vargaData = chartData[v.id] as Record<string, string> | null;
                        if (vargaData && typeof vargaData === 'object') {
                            matrix[p][v.id] = vargaData[p] || (fullName ? vargaData[fullName] : "");
                        }
                    }

                    // Try raw positions (planetary_positions.Su.vargas.D1)
                    if (!matrix[p][v.id]) {
                        const planetaryPositions = chartData.planetary_positions as Record<string, unknown> | null;
                        if (planetaryPositions) {
                            const pos = (planetaryPositions[p] || (fullName ? planetaryPositions[fullName] : null)) as Record<string, unknown> | null;
                            matrix[p][v.id] = (pos?.vargas as Record<string, string>)?.[v.id] || (pos?.[v.id] as string) || "";
                        }
                    }
                });

                // Use pre-calculated Vimsopaka if available, otherwise 0
                const vimsopakaScores = (chartData.vimsopaka_scores || chartData.scores) as Record<string, number> | undefined;
                const fullName = PLANET_MAP[p]?.full;
                scores[p] = vimsopakaScores?.[p] || (fullName ? vimsopakaScores?.[fullName] : 0) || 0;
            });
        }

        // 2. Fallback to individual charts if summary is missing or incomplete
        PLANETS.forEach(p => {
            if (!matrix[p]) matrix[p] = {};

            VARGAS.forEach(v => {
                if (!matrix[p][v.id] || matrix[p][v.id] === "") {
                    const chart = filteredCharts.find((c: ChartEntry) => c.chartType === v.id);
                    const sign = extractPlanetSign(chart?.chartData, p);
                    if (sign) matrix[p][v.id] = sign;
                }
            });
        });

        // 3. Recalculate scores if missing or all zero
        const needsCalculation = PLANETS.some(p => !scores[p] || scores[p] === 0);
        if (needsCalculation) {
            PLANETS.forEach(p => {
                let total = 0;
                let foundAny = false;
                VARGAS.forEach(v => {
                    const sign = matrix[p][v.id];
                    if (sign) {
                        foundAny = true;
                        const dignity = getDignityDetails(p, sign);
                        if (dignity?.label === 'Ucha') total += v.weight * 1.5;
                        else if (dignity?.label === 'Swa') total += v.weight * 1.0;
                        else if (dignity?.label === 'Neecha') total += v.weight * 0.2;
                        else total += v.weight * 0.7;
                    }
                });
                if (foundAny) {
                    scores[p] = parseFloat(Math.min(20, (total / 30) * 20).toFixed(1));
                }
            });
        }

        return { matrix, scores };
    }, [data, activeSystem]);

    return (
        <TooltipProvider>
            <div className={cn("bg-white/40 backdrop-blur-xl rounded-[1.5rem] border border-copper-100 shadow-xl shadow-copper-200/30 overflow-hidden", className)}>
                {/* Header Section */}
                <div className="p-4 border-b border-copper-100 bg-gradient-to-br from-copper-50/80 via-white to-copper-50/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-copper-600 rounded-xl shadow-md">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-serif text-copper-900 font-bold leading-tight">Dignity Matrix</h3>
                            <p className="text-[10px] text-copper-500 font-medium">Planetary strength across 10 vargas</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-copper-900 border border-copper-800 text-copper-50 rounded-xl text-[10px] font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-transform cursor-default group">
                            <Zap className="w-3 h-3 text-amber-400 group-hover:rotate-12 transition-transform" />
                            <span>Vimsopaka Scale</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-copper-50/30">
                                <th className="p-3 text-[9px] uppercase tracking-wider font-black text-copper-400 border-b border-copper-100 sticky left-0 bg-white/95 backdrop-blur z-10 w-24">Planet</th>
                                {VARGAS.map(v => (
                                    <th key={v.id} className="p-2 border-b border-copper-100 group">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center cursor-help">
                                                    <span className="text-[11px] font-black text-copper-900 leading-none">{v.id}</span>
                                                    <span className="text-[8px] font-bold text-copper-400 uppercase mt-0.5 tracking-tighter">{v.label.substring(0, 3)}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-3 bg-copper-900 text-white rounded-xl border-none shadow-2xl">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-sm">{v.label} ({v.id})</p>
                                                    <p className="text-xs text-copper-200 leading-relaxed max-w-[180px]">{v.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-copper-800/50">
                                                        <Award className="w-3 h-3 text-amber-400" />
                                                        <span className="text-[10px] font-bold">Weightage: {v.weight}</span>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </th>
                                ))}
                                <th className="p-3 text-[9px] uppercase tracking-wider font-black text-copper-600 border-b border-copper-100 text-right bg-copper-50/40">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-copper-50">
                            {PLANETS.map(p => {
                                const score = normalizedData.scores[p];
                                return (
                                    <tr key={p} className="hover:bg-copper-50/20 transition-all group">
                                        <td className="p-3 font-bold text-copper-900 border-r border-copper-50/50 sticky left-0 bg-white/95 backdrop-blur z-10 group-hover:text-indigo-600 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-copper-300 group-hover:bg-indigo-400 transition-colors" />
                                                <span className="text-xs">{PLANET_MAP[p]?.full || p}</span>
                                            </div>
                                        </td>
                                        {VARGAS.map(v => {
                                            const sign = normalizedData.matrix[p][v.id];
                                            const details = getDignityDetails(p, sign);

                                            return (
                                                <td key={v.id} className="p-1 text-center align-middle">
                                                    {sign ? (
                                                        <div className="flex flex-col items-center py-1">
                                                            <span className="text-[11px] text-copper-800 font-serif font-medium leading-none">{sign.substring(0, 3)}</span>
                                                            <span className={cn(
                                                                "text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border mt-1 tracking-tighter transition-all group-hover:scale-105",
                                                                details?.color
                                                            )}>
                                                                {details?.label}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-10">
                                                            <div className="w-4 h-[2px] bg-copper-100 rounded-full" />
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="p-3 text-right bg-copper-50/5">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1",
                                                    score >= 15 ? "text-emerald-700 bg-emerald-100/50 border border-emerald-200" :
                                                        score >= 10 ? "text-indigo-700 bg-indigo-100/50 border border-indigo-200" :
                                                            "text-amber-700 bg-amber-100/50 border border-amber-200"
                                                )}>
                                                    {score}
                                                </div>
                                                <div className="w-12 h-1 bg-copper-100 rounded-full overflow-hidden border border-white">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-1000 ease-out",
                                                            score >= 15 ? "bg-emerald-500" : score >= 10 ? "bg-indigo-500" : "bg-amber-500"
                                                        )}
                                                        style={{ width: `${(score / 20) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Legend */}
                <div className="p-4 bg-gradient-to-tr from-copper-50/50 to-white border-t border-copper-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                            <span className="text-[9px] text-copper-600 font-black uppercase tracking-widest">Ucha</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />
                            <span className="text-[9px] text-copper-600 font-black uppercase tracking-widest">Swa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                            <span className="text-[9px] text-copper-600 font-black uppercase tracking-widest">Neecha</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-copper-400 font-bold uppercase tracking-tight">
                        <Info className="w-3 h-3" />
                        <span>Vimsopaka Analysis</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
