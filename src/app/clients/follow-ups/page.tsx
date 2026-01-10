"use client";

import React from 'react';
import { AlertCircle, Calendar, Phone, ArrowRight } from 'lucide-react';

export default function FollowUpsPage() {
    // Mock data for follow-ups
    const followUps = [
        { id: 1, name: "Ananya Sharma", reason: "Remedy check - Blue Sapphire", dueDate: "Today", priority: "high" },
        { id: 2, name: "Vikram Singh", reason: "Career prediction follow-up", dueDate: "Tomorrow", priority: "medium" },
        { id: 3, name: "Priya Mehta", reason: "Marriage timing confirmation", dueDate: "In 3 days", priority: "normal" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-gold-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-ink">Follow-Ups Due</h1>
                    <p className="text-sm text-muted">Clients requiring your attention</p>
                </div>
            </div>

            {/* Follow-up Cards */}
            <div className="space-y-3">
                {followUps.map((item) => (
                    <div key={item.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif font-bold text-gold-dark">
                                {item.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-ink">{item.name}</h3>
                                <p className="text-sm text-muted">{item.reason}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${item.priority === "high" ? "bg-red-50 text-red-600 border border-red-200" :
                                    item.priority === "medium" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                                        "bg-green-50 text-green-600 border border-green-200"
                                }`}>
                                {item.dueDate}
                            </div>
                            <button className="p-2 rounded-lg bg-parchment hover:bg-gold-primary/20 text-muted hover:text-ink transition-colors">
                                <Phone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-softwhite border border-antique rounded-xl p-5 flex items-center justify-between">
                <span className="text-sm text-muted">Total pending follow-ups</span>
                <span className="font-serif font-bold text-ink">{followUps.length}</span>
            </div>
        </div>
    );
}
