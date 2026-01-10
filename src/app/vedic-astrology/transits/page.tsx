"use client";

import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function TransitsPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-gold-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-ink">Current Transits</h1>
                    <p className="text-sm text-muted">Planetary movements over {clientDetails.name}'s birth chart</p>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="bg-softwhite border border-antique rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-primary/10 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-gold-primary" />
                </div>
                <h2 className="text-xl font-serif text-ink mb-2">Transit Analysis</h2>
                <p className="text-muted mb-6 max-w-md mx-auto">
                    View current planetary transits overlaid on the natal chart. See Saturn, Rahu, Ketu, and Jupiter's impact on key houses.
                </p>
                <div className="inline-flex items-center gap-2 text-gold-dark text-sm font-medium">
                    <span>Coming Soon</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            {/* Quick Transit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TransitCard planet="Saturn" sign="Pisces" house="5th" impact="Moderate" />
                <TransitCard planet="Rahu" sign="Pisces" house="5th" impact="High" />
                <TransitCard planet="Jupiter" sign="Taurus" house="7th" impact="Benefic" />
            </div>
        </div>
    );
}

function TransitCard({ planet, sign, house, impact }: { planet: string; sign: string; house: string; impact: string }) {
    const impactColor = impact === "Benefic" ? "text-green-600" : impact === "High" ? "text-red-500" : "text-gold-dark";

    return (
        <div className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-ink">{planet}</span>
                <span className={`text-xs font-semibold uppercase ${impactColor}`}>{impact}</span>
            </div>
            <div className="text-sm text-muted">
                <span className="text-body font-medium">{sign}</span> • {house} House
            </div>
        </div>
    );
}
