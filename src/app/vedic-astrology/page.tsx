"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { clientApi } from "@/lib/api";
import { Client } from "@/types/client";

export default function VedicClientSelectionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoading(true);
                // Fetch only clients belonging to the logged-in astrologer
                const response = await clientApi.getClients({ myClientsOnly: true, limit: 100 });
                setClients(response.clients || []);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                setError("Failed to load soul archives. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        (client.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.placeOfBirth?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.birthPlace?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700 py-4 px-0">
            <div className="px-4 text-xs font-serif uppercase tracking-widest font-bold text-[#6B4423]">
                Vedic Astrology
            </div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
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
            <div className="mx-0 bg-softwhite backdrop-blur-md p-4 rounded-3xl border border-antique shadow-card relative overflow-hidden group">
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
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 text-gold-primary animate-spin mb-4" />
                        <p className="font-serif text-lg text-[#6B4423] animate-pulse">Consulting the archives...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-32 rounded-3xl bg-red-50 border border-red-100">
                        <p className="font-serif text-xl text-red-600 mb-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs font-bold uppercase tracking-widest text-[#6B4423] underline decoration-gold-primary decoration-2 underline-offset-4 hover:text-gold-dark"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredClients.length > 0 ? (
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
            {!isLoading && !error && (
                <div className="pt-8 border-t border-divider text-center">
                    <span className="font-serif text-[10px] text-bronze font-black uppercase tracking-[0.3em]">
                        Synchronized with {filteredClients.length} Collective Records
                    </span>
                </div>
            )}
        </div>
    );
}
