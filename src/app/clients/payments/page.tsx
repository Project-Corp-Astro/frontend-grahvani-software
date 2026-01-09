"use client";

import React from 'react';
import { CreditCard } from 'lucide-react';

export default function ClientPaymentsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-[#D08C60]/30"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                }}
            >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <CreditCard className="w-5 h-5 text-[#D08C60]" />
                    <h1 className="font-serif text-2xl font-bold text-[#FEFAEA]">Payments & Invoices</h1>
                </div>
            </div>
            <div className="p-12 text-center border border-dashed border-[#D08C60] rounded-lg bg-[#FEFAEA]/50">
                <p className="text-[#7A5A43] font-serif">Payments list module content.</p>
            </div>
        </div>
    );
}
