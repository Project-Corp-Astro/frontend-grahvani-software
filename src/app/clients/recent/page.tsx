"use client";

import React from 'react';
import { History, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RecentSessionsPage() {
    // Mock data for recent sessions (last 7 days)
    const recentSessions = [
        { id: 1, name: "Ananya Sharma", date: "2026-01-10", time: "10:30 AM", topic: "Career guidance", duration: "45 min" },
        { id: 2, name: "Vikram Singh", date: "2026-01-09", time: "2:00 PM", topic: "Marriage timing", duration: "30 min" },
        { id: 3, name: "Priya Mehta", date: "2026-01-08", time: "11:00 AM", topic: "Health concerns", duration: "40 min" },
        { id: 4, name: "Rahul Verma", date: "2026-01-06", time: "4:30 PM", topic: "Business partnership", duration: "35 min" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <History className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Recent Sessions</h1>
                        <p className="text-sm text-muted">Consultations from the last 7 days</p>
                    </div>
                </div>
            </div>

            {/* Session Cards */}
            <div className="space-y-3">
                {recentSessions.map((session) => (
                    <div key={session.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif font-bold text-gold-dark">
                                    {session.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-ink">{session.name}</h3>
                                    <p className="text-sm text-muted">{session.topic}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-sm text-body">
                                    <Calendar className="w-3.5 h-3.5 text-muted" />
                                    {session.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted mt-1">
                                    <Clock className="w-3 h-3" />
                                    {session.time} • {session.duration}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-softwhite border border-antique rounded-xl p-5 flex items-center justify-between">
                <span className="text-sm text-muted">Sessions this week</span>
                <span className="font-serif font-bold text-ink">{recentSessions.length}</span>
            </div>
        </div>
    );
}
