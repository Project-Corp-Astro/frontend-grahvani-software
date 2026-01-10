"use client";

import React from 'react';
import { Gem, Sparkles, Moon, Sun } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function RemediesPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-gold-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-ink">Remedies & Guidance</h1>
                    <p className="text-sm text-muted">Prescriptions for {clientDetails.name}'s planetary balance</p>
                </div>
            </div>

            {/* Remedy Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <RemedyCard
                    icon={<Gem className="w-5 h-5" />}
                    title="Gemstones"
                    description="Recommended stones based on Lagna and Dasha lord"
                    items={["Blue Sapphire (Saturn)", "Cat's Eye (Ketu)"]}
                />
                <RemedyCard
                    icon={<Sparkles className="w-5 h-5" />}
                    title="Mantras"
                    description="Japa practices for planetary propitiation"
                    items={["Shani Mantra - 23,000", "Ketu Beej Mantra"]}
                />
                <RemedyCard
                    icon={<Moon className="w-5 h-5" />}
                    title="Rituals & Donations"
                    description="Suggested pujas and charitable acts"
                    items={["Shani Shanti Puja", "Donate black sesame on Saturday"]}
                />
            </div>

            {/* Guidance Notes */}
            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                <h3 className="font-serif font-bold text-ink mb-3">Astrologer's Guidance</h3>
                <p className="text-body text-sm leading-relaxed">
                    Focus on strengthening Saturn through discipline and service. Avoid making major decisions during Ketu Antar-dasha transitions.
                    Wear Blue Sapphire only after proper energization on a Saturday morning.
                </p>
            </div>
        </div>
    );
}

function RemedyCard({ icon, title, description, items }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    items: string[]
}) {
    return (
        <div className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                    {icon}
                </div>
                <h3 className="font-serif font-bold text-ink">{title}</h3>
            </div>
            <p className="text-xs text-muted mb-3">{description}</p>
            <ul className="space-y-1">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-body flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
