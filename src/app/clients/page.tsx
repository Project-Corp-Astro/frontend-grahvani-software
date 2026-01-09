"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import GoldenButton from "@/components/GoldenButton";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { Client } from "@/types/client";

// MOCK DATA - strictly for UI architecture validation as per user request not to connect backend yet
const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        firstName: 'Ananya',
        lastName: 'Sharma',
        dateOfBirth: '1992-08-15',
        timeOfBirth: '14:30',
        placeOfBirth: 'New Delhi, India',
        lastConsulted: '2025-12-01',
        rashi: 'Leo',
    },
    {
        id: '2',
        firstName: 'Vikram',
        lastName: 'Singh',
        dateOfBirth: '1985-04-20',
        timeOfBirth: '09:15',
        placeOfBirth: 'Jaipur, India',
        lastConsulted: '2026-01-05',
        rashi: 'Aries',
    },
    {
        id: '3',
        firstName: 'Priya',
        lastName: 'Verma',
        dateOfBirth: '1998-11-05',
        timeOfBirth: '23:45',
        placeOfBirth: 'Mumbai, India',
        lastConsulted: '2024-11-20',
        rashi: 'Scorpio',
    }
];

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients] = useState<Client[]>(MOCK_CLIENTS);

    const filteredClients = clients.filter(client =>
        client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.placeOfBirth.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-white tracking-tight mb-2">
                        Client Registry
                    </h1>
                    <p className="font-serif text-[#D08C60] italic text-lg opacity-80">
                        The archives of souls and their celestial blueprints.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new" className="px-8 py-4 bg-gradient-to-r from-[#D08C60] to-[#763A1F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_30px_rgba(118,58,31,0.4)] hover:scale-105 transition-transform border border-white/10">
                        Add New Soul
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-[#2A1810]/40 backdrop-blur-md p-8 rounded-3xl border border-[#D08C60]/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD27D]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <ParchmentInput
                        placeholder="Search soul archives by name or city..."
                        icon={<Search className="w-5 h-5 text-[#D08C60]" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#D08C60]/50 h-14 text-lg rounded-2xl"
                    />
                </div>
            </div>

            {/* Client List */}
            <div className="space-y-4">
                {filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredClients.map(client => (
                            <ClientListRow key={client.id} client={client} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-3xl bg-white/5 border border-white/5">
                        <p className="font-serif text-2xl italic text-white/20">
                            No constellations match your search.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination / Total Count Footer */}
            <div className="pt-8 border-t border-white/5 text-center">
                <span className="font-serif text-[10px] text-[#D08C60] font-black uppercase tracking-[0.3em]">
                    Synchronized with {filteredClients.length} Collective Records
                </span>
            </div>
        </div>
    );
}
