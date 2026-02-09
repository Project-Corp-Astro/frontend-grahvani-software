"use client";

import React from 'react';
import {
    Moon,
    Sun,
    Zap,
    RefreshCcw,
    CalendarDays,
    Sunrise,
    Sunset
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface PanchangaItemProps {
    label: string;
    value: string;
    subValue?: string;
    progress?: number;
    icon: React.ElementType;
    color: string;
}

function PanchangaItem({ label, value, subValue, icon: Icon, color }: PanchangaItemProps) {
    return (
        <div className="bg-white/40 p-1 rounded-lg border border-antique/20 flex items-center gap-1.5 shadow-sm group hover:border-gold-primary/30 transition-all">
            <div className={cn("p-1 rounded-md bg-white shrink-0 shadow-xs group-hover:bg-gold-primary/5 transition-colors", color)}>
                <Icon className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[8px] text-secondary/60 uppercase tracking-tighter font-bold mb-0">{label}</p>
                <p className="text-[10px] font-serif text-primary font-bold leading-none truncate">{value}</p>
                {subValue && (
                    <p className="text-[9px] text-muted-refined/70 leading-none truncate mt-0.5">{subValue}</p>
                )}
            </div>
        </div>
    );
}

export default function BirthPanchanga({ data }: { data: any }) {
    if (!data || !data.panchanga) {
        return (
            <div className="p-3 text-center border border-antique/30 rounded-lg bg-softwhite/50 italic text-muted-refined text-[10px]">
                Panchanga data loading...
            </div>
        );
    }

    const { panchanga, times } = data;
    const { tithi, nakshatra, yoga, karana, vara } = panchanga;

    return (
        <div className="space-y-1">
            <div className="grid grid-cols-2 gap-1">
                <PanchangaItem
                    label="Tithi"
                    value={tithi.name}
                    subValue={tithi.paksha}
                    icon={Moon}
                    color="text-indigo-400"
                />
                <PanchangaItem
                    label="Nakshatra"
                    value={nakshatra.name}
                    subValue={`Pada ${nakshatra.pada}`}
                    icon={Zap}
                    color="text-amber-400"
                />
                <PanchangaItem
                    label="Yoga"
                    value={yoga.name}
                    icon={RefreshCcw}
                    color="text-teal-400"
                />
                <PanchangaItem
                    label="Karana"
                    value={karana.name}
                    icon={CalendarDays}
                    color="text-rose-400"
                />
            </div>

            <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/40 border border-antique/20 shadow-sm">
                    <Sunrise className="w-3 h-3 text-accent-gold" />
                    <div className="min-w-0">
                        <p className="text-[8px] text-secondary/60 uppercase tracking-tighter font-bold mb-0">Sunrise</p>
                        <p className="text-[10px] font-bold text-primary leading-none">{times.sunrise.time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/40 border border-antique/20 shadow-sm">
                    <Sunset className="w-3 h-3 text-indigo-400" />
                    <div className="min-w-0">
                        <p className="text-[8px] text-secondary/60 uppercase tracking-tighter font-bold mb-0">Sunset</p>
                        <p className="text-[10px] font-bold text-primary leading-none">{times.sunset.time}</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <span className="text-[9px] font-bold text-accent-gold uppercase tracking-widest bg-gold-primary/5 px-2 py-0.5 rounded-full border border-gold-primary/10 shadow-xs">
                    Birth Vara: {vara.name}
                </span>
            </div>
        </div>
    );
}
