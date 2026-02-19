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
        <div className="bg-white/40 p-2 rounded-lg border border-antique/20 flex items-center gap-2 shadow-sm group hover:border-gold-primary/30 transition-all">
            <div className={cn("p-1 rounded-md bg-white shrink-0 shadow-xs group-hover:bg-gold-primary/5 transition-colors", color)}>
                <Icon className="w-3 h-3" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[8px] text-primary tracking-normal mb-0 font-serif">{label}</p>
                <p className="text-[10px] font-serif text-primary leading-none truncate">{value}</p>
                {subValue && (
                    <p className="text-[9px] text-primary leading-none truncate mt-0.5 font-serif">{subValue}</p>
                )}
            </div>
        </div>
    );
}

export default function BirthPanchanga({ data }: { data: any }) {
    if (!data || !data.panchanga) {
        return (
            <div className="p-3 text-center border border-antique/30 rounded-lg bg-softwhite/50  text-primary text-[10px] font-serif">
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

            <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/40 border border-antique/20 shadow-sm">
                    <Sunrise className="w-3 h-3 text-accent-gold" />
                    <div className="min-w-0">
                        <p className="text-[8px] text-primary tracking-normal mb-0 font-serif">Sunrise</p>
                        <p className="text-[10px] text-primary leading-none font-serif">{times.sunrise.time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/40 border border-antique/20 shadow-sm">
                    <Sunset className="w-3 h-3 text-indigo-400" />
                    <div className="min-w-0">
                        <p className="text-[8px] text-primary tracking-normal mb-0 font-serif">Sunset</p>
                        <p className="text-[10px] text-primary leading-none font-serif">{times.sunset.time}</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <span className="text-[9px] font-medium text-primary tracking-normal bg-gold-primary/5 px-2 py-0.5 rounded-full border border-gold-primary/10 shadow-xs font-serif">
                    Birth Vara: {vara.name}
                </span>
            </div>
        </div>
    );
}
