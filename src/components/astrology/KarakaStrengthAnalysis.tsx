"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Shield, Activity, Target, Zap } from 'lucide-react';

interface KarakaStrengthAnalysisProps {
    data: any;
    className?: string;
}

export default function KarakaStrengthAnalysis({ data, className }: KarakaStrengthAnalysisProps) {
    if (!data || !data.planets) return null;

    const planets = Object.entries(data.planets).map(([name, info]: [string, any]) => ({
        name,
        ...info
    })).sort((a, b) => (b.strength || 0) - (a.strength || 0));

    return (
        <div className={cn("w-full space-y-6", className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Ayanamsa"
                    value={data.metadata?.ayanamsa || 'Standard'}
                    icon={<Shield className="w-4 h-4" />}
                    color="amber"
                />
                <StatCard
                    title="House System"
                    value={data.metadata?.house_system || 'Whole Sign'}
                    icon={<Activity className="w-4 h-4" />}
                    color="rose"
                />
                <StatCard
                    title="Highest Strength"
                    value={planets[0]?.strength?.toFixed(2) || '0.00'}
                    icon={<Zap className="w-4 h-4" />}
                    color="copper"
                />
                <StatCard
                    title="Atmakaraka"
                    value={planets.find(p => p.chara_karaka === 'Atmakaraka')?.name || 'N/A'}
                    icon={<Target className="w-4 h-4" />}
                    color="amber"
                />
            </div>

            <div className="bg-[#FFFCF6] border border-antique rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#EAD8B1] px-4 py-2 border-b border-antique">
                    <h3 className="text-lg font-serif font-bold text-primary">Karaka Strength Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-parchment/30 text-[10px] uppercase font-bold text-primary tracking-wider">
                                <th className="px-4 py-3 border-b border-antique/30">Planet</th>
                                <th className="px-4 py-3 border-b border-antique/30">Chara Karaka</th>
                                <th className="px-4 py-3 border-b border-antique/30">Fixed Karaka</th>
                                <th className="px-4 py-3 border-b border-antique/30 text-center">House</th>
                                <th className="px-4 py-3 border-b border-antique/30 text-right">Strength</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {planets.map((p, idx) => (
                                <tr key={p.name} className={cn(
                                    "hover:bg-parchment/50 transition-colors border-b border-antique/20 last:border-0",
                                    idx % 2 === 1 ? "bg-antique/5" : "bg-transparent"
                                )}>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-primary">{p.name}</span>
                                            <span className="text-[10px] text-secondary font-mono">{(p.longitude || 0).toFixed(2)}°</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-emerald-700">
                                        {p.chara_karaka || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-secondary italic">
                                        {p.fixed_karaka || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-primary">
                                        {p.house}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-1.5 bg-antique/20 rounded-full overflow-hidden hidden sm:block">
                                                <div
                                                    className="h-full bg-gold-primary rounded-full"
                                                    style={{ width: `${Math.min(100, (p.strength || 0) * 33)}%` }}
                                                />
                                            </div>
                                            <span className="font-mono font-bold text-primary w-10 text-right">
                                                {(p.strength || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: 'amber' | 'rose' | 'copper' }) {
    return (
        <div className={cn(
            "p-4 rounded-2xl border flex items-center gap-4",
            color === 'amber' ? "bg-amber-50/50 border-amber-100" :
                color === 'rose' ? "bg-rose-50/50 border-rose-100" :
                    "bg-copper-50/50 border-copper-100"
        )}>
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                color === 'amber' ? "bg-amber-100 text-amber-600" :
                    color === 'rose' ? "bg-rose-100 text-rose-600" :
                        "bg-copper-100 text-copper-600"
            )}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">{title}</p>
                <p className="text-sm font-serif font-bold text-primary">{value}</p>
            </div>
        </div>
    );
}
