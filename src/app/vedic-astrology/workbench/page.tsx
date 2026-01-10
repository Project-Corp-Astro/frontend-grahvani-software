"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Calendar,
    FileText,
    ArrowRight,
    Sparkles,
    Activity,
    Target,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';

export default function AnalyticalWorkbenchPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    const MOCK_PLANETS = [
        { name: 'Su', signId: 8, degree: '22°' },
        { name: 'Mo', signId: 8, degree: '05°' },
        { name: 'Ma', signId: 8, degree: '12°' },
        { name: 'Me', signId: 9, degree: '08°' },
        { name: 'Ju', signId: 3, degree: '15°' },
        { name: 'Ve', signId: 6, degree: '18°' },
        { name: 'Sa', signId: 11, degree: '03°' },
        { name: 'Ra', signId: 8, degree: '25°' },
        { name: 'Ke', signId: 2, degree: '25°' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Analytical Workbench</h1>
                        <p className="text-sm text-muted">Deep analysis tools for {clientDetails.name}</p>
                    </div>
                </div>
                <Link href="/vedic-astrology/overview" className="px-4 py-2 bg-parchment border border-antique rounded-lg text-sm font-medium text-body hover:bg-softwhite transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Overview
                </Link>
            </div>

            {/* Quick Tools Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickToolCard
                    href="/vedic-astrology/planets"
                    icon={<Activity className="w-5 h-5" />}
                    title="Planetary Strength"
                    desc="Shadbala & Ashtakavarga"
                />
                <QuickToolCard
                    href="/vedic-astrology/divisional"
                    icon={<Target className="w-5 h-5" />}
                    title="Divisional Charts"
                    desc="D1 to D60 analysis"
                />
                <QuickToolCard
                    href="/vedic-astrology/dashas"
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="Dasha Explorer"
                    desc="Timeline predictions"
                />
                <QuickToolCard
                    href="/vedic-astrology/transits"
                    icon={<Calendar className="w-5 h-5" />}
                    title="Transit Analysis"
                    desc="Current planetary impact"
                />
            </div>

            {/* Main Workbench Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Interactive Chart */}
                <div className="lg:col-span-2 bg-softwhite border border-antique rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif font-bold text-ink">Interactive Rashi Chart</h2>
                        <select className="text-sm bg-parchment border border-antique rounded-lg px-3 py-1.5 text-body focus:outline-none focus:border-gold-primary">
                            <option>D1 - Rashi</option>
                            <option>D9 - Navamsha</option>
                            <option>D10 - Dashamsha</option>
                            <option>D7 - Saptamsha</option>
                        </select>
                    </div>
                    <div className="aspect-square max-w-md mx-auto bg-parchment rounded-xl p-4 border border-antique/50">
                        <NorthIndianChart
                            ascendantSign={8}
                            planets={MOCK_PLANETS}
                            className="bg-transparent border-none"
                        />
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="space-y-4">
                    <div className="bg-softwhite border border-antique rounded-xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-primary" />
                            House Focus
                        </h3>
                        <p className="text-sm text-muted mb-3">Click a house in the chart to analyze</p>
                        <div className="space-y-2">
                            <HouseStat house="1st" sign="Scorpio" planets="Ma, Ke, Ra" strength="Strong" />
                            <HouseStat house="7th" sign="Taurus" planets="—" strength="Neutral" />
                            <HouseStat house="10th" sign="Leo" planets="—" strength="Weak" />
                        </div>
                    </div>

                    <div className="bg-softwhite border border-antique rounded-xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold-primary" />
                            Aspect Analysis
                        </h3>
                        <div className="text-sm text-body space-y-2">
                            <p><span className="font-medium text-ink">Saturn</span> aspects 3rd, 7th, 10th</p>
                            <p><span className="font-medium text-ink">Mars</span> aspects 4th, 7th, 8th</p>
                            <p><span className="font-medium text-ink">Jupiter</span> aspects 5th, 7th, 9th</p>
                        </div>
                    </div>

                    <Link href="/vedic-astrology/reports" className="block bg-gold-primary/10 border border-gold-primary/30 rounded-xl p-5 hover:bg-gold-primary/20 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gold-dark" />
                                <span className="font-serif font-bold text-ink">Generate Report</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gold-dark group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-muted mt-2">Create detailed prediction report</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function QuickToolCard({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
    return (
        <Link href={href} className="bg-softwhite border border-antique rounded-xl p-4 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary group-hover:bg-gold-primary group-hover:text-white transition-colors">
                    {icon}
                </div>
            </div>
            <h3 className="font-serif font-bold text-ink text-sm">{title}</h3>
            <p className="text-xs text-muted">{desc}</p>
        </Link>
    );
}

function HouseStat({ house, sign, planets, strength }: { house: string; sign: string; planets: string; strength: string }) {
    const strengthColor = strength === "Strong" ? "text-green-600" : strength === "Weak" ? "text-red-500" : "text-muted";
    return (
        <div className="flex items-center justify-between text-sm">
            <div>
                <span className="font-medium text-ink">{house}</span>
                <span className="text-muted ml-2">{sign}</span>
            </div>
            <span className={cn("text-xs font-medium", strengthColor)}>{strength}</span>
        </div>
    );
}
