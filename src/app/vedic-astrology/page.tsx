"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { MOCK_CLIENTS } from "@/data/mockClients";
import { Client } from "@/types/client";

export default function VedicClientSelectionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients] = useState<Client[]>(MOCK_CLIENTS);

    const filteredClients = clients.filter(client =>
        (client.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.placeOfBirth?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.birthPlace?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pt-8 pb-20 px-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-ink tracking-tight mb-2">
                        Client Registry
                    </h1>
                    <p className="font-serif text-muted italic text-lg opacity-80">
                        The archives of souls and their celestial blueprints.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new" className="px-8 py-4 bg-gradient-to-r from-gold-primary to-gold-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-button hover:scale-105 transition-transform border border-white/10">
                        Add New Soul
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-softwhite backdrop-blur-md p-8 rounded-3xl border border-antique shadow-card relative overflow-hidden group">
                <div className="absolute inset-0 bg-parchment opacity-50 pointer-events-none" />
                <div className="relative z-10">
                    <ParchmentInput
                        placeholder="Search soul archives by name or city..."
                        icon={<Search className="w-5 h-5 text-gold-dark" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-parchment border-antique text-ink placeholder:text-muted focus:border-gold-primary h-14 text-lg rounded-2xl"
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
                    <div className="text-center py-32 rounded-3xl bg-softwhite border border-antique">
                        <p className="font-serif text-2xl italic text-muted">
                            No constellations match your search.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination / Total Count Footer */}
            <div className="pt-8 border-t border-divider text-center">
                <span className="font-serif text-[10px] text-bronze font-black uppercase tracking-[0.3em]">
                    Synchronized with {filteredClients.length} Collective Records
                </span>
            </div>
        </div>
    );
}
