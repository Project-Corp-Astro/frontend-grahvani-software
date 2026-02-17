"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Check, Info, AlertTriangle, Dog, Bird, User, Hand, EyeOff, Sparkles } from 'lucide-react';

interface RemedyCardProps {
    planet: string;
    focusType: string;
    diagnosis: string;
    remedyText: string;
    time: string;
    constraint: string;
    status: 'Pending' | 'Recommended' | 'Completed' | 'In Progress';
    progress?: number;
}

export default function RemedyCard({
    planet,
    focusType,
    diagnosis,
    remedyText,
    time,
    constraint,
    status,
    progress = 0
}: RemedyCardProps) {

    // Choose icon based on planet or remedy keywords
    const getIcon = () => {
        const lowerRemedy = remedyText.toLowerCase();
        const lowerPlanet = planet.toLowerCase();

        if (lowerRemedy.includes('dog')) return <Dog className="w-10 h-10 text-slate-400" />;
        if (lowerRemedy.includes('crow') || lowerRemedy.includes('bird')) return <Bird className="w-10 h-10 text-slate-400" />;
        if (lowerRemedy.includes('silver') || lowerRemedy.includes('wear')) return <User className="w-10 h-10 text-slate-400" />;
        if (lowerRemedy.includes('tilak') || lowerRemedy.includes('forehead')) return <Hand className="w-10 h-10 text-slate-400" />;

        // Default planet icons
        if (lowerPlanet === 'ketu') return <EyeOff className="w-10 h-10 text-slate-400" />;
        return <Sparkles className="w-10 h-10 text-slate-400" />;
    };

    const isKetu = planet.toLowerCase() === 'ketu';
    const isJupiter = planet.toLowerCase() === 'jupiter';

    return (
        <div className={cn(
            "bg-white rounded-3xl overflow-hidden flex flex-col shadow-xl transition-all duration-500 hover:scale-[1.02]",
            isJupiter ? "border-l-[6px] border-amber-500" : "border-l-[6px] border-blue-600"
        )}>
            {/* Header / Title bar */}
            <div className={cn(
                "px-4 py-2 flex items-center justify-between text-white font-bold text-xs",
                isJupiter ? "bg-amber-600" : "bg-blue-700"
            )}>
                <span>{planet} | {focusType}</span>
            </div>

            {/* Main Content Area */}
            <div className="p-5 flex gap-5">
                {/* Visual Icon Section */}
                <div className="flex-shrink-0 w-24 h-24 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative group-hover:bg-white transition-colors">
                    {getIcon()}
                    {/* Tiny info pulse */}
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500/20" />
                </div>

                {/* Text Data Section */}
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                        {/* Diagnosis */}
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Diagnosis:</span>
                            <span className="text-[11px] font-bold text-slate-700 leading-tight">{diagnosis}</span>
                        </div>

                        {/* Remedy */}
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Remedy:</span>
                            <span className="text-[11px] font-bold text-blue-900 leading-tight">{remedyText}</span>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter">Time:</span>
                                <span className="text-[10px] font-bold text-slate-600">{time}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter">Constraint:</span>
                                <span className="text-[10px] font-bold text-slate-600">{constraint}</span>
                            </div>
                        </div>

                        {/* Status bar */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter">Status: {status}</span>
                            {status === 'Recommended' ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                                </div>
                            ) : status === 'In Progress' ? (
                                <div className="relative w-6 h-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="12" cy="12" r="10" stroke="#f1f5f9" strokeWidth="2" fill="none" />
                                        <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="62.8" strokeDashoffset={62.8 - (62.8 * (progress / 100))} />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-blue-600">{progress}%</span>
                                </div>
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
