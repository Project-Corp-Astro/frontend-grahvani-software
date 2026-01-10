"use client";

import React from 'react';
import { Gem, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PendingRemediesPage() {
    // Mock data for pending remedies
    const pendingRemedies = [
        {
            id: 1,
            name: "Ananya Sharma",
            remedy: "Blue Sapphire (Neelam)",
            type: "Gemstone",
            prescribed: "2026-01-05",
            status: "awaiting_confirmation"
        },
        {
            id: 2,
            name: "Vikram Singh",
            remedy: "Shani Mantra - 23,000 Japa",
            type: "Mantra",
            prescribed: "2026-01-03",
            status: "in_progress"
        },
        {
            id: 3,
            name: "Priya Mehta",
            remedy: "Shani Shanti Puja",
            type: "Puja",
            prescribed: "2025-12-28",
            status: "awaiting_confirmation"
        },
    ];

    const getStatusBadge = (status: string) => {
        if (status === "in_progress") {
            return <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" /> In Progress
            </span>;
        }
        return <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg">
            <AlertCircle className="w-3 h-3" /> Awaiting Confirmation
        </span>;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-gold-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-ink">Pending Remedies</h1>
                    <p className="text-sm text-muted">Track prescribed remedies awaiting completion</p>
                </div>
            </div>

            {/* Remedy Cards */}
            <div className="space-y-3">
                {pendingRemedies.map((item) => (
                    <div key={item.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif font-bold text-gold-dark">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-ink">{item.name}</h3>
                                    <p className="text-sm text-body font-medium">{item.remedy}</p>
                                    <p className="text-xs text-muted mt-1">{item.type} • Prescribed {item.prescribed}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(item.status)}
                                <button className="text-xs text-gold-dark hover:text-gold-primary font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mark Complete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-softwhite border border-antique rounded-xl p-5 flex items-center justify-between">
                <span className="text-sm text-muted">Total pending remedies</span>
                <span className="font-serif font-bold text-ink">{pendingRemedies.length}</span>
            </div>
        </div>
    );
}
