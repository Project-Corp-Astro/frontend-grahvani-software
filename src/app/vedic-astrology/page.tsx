"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added useRouter import
import { Search, Loader2 } from 'lucide-react';
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { useClients } from "@/hooks/queries/useClients"; // Added useClients import
import { Client } from "@/types/client";

export default function VedicClientSelectionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Clients Query
    const { data: clientsData, isLoading: loading, error: clientsError } = useClients({
        myClientsOnly: true,
        limit: 100
    });
    const clients = clientsData?.clients || [];
    const error = clientsError ? (clientsError as Error).message : null;

    const filteredClients = clients.filter(client =>
        (client.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.placeOfBirth?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.birthPlace?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700 py-4 px-0">
            <div className="px-4 font-sans text-xs font-medium uppercase tracking-wider text-secondary leading-compact">
                Vedic Astrology
            </div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h1 className="font-serif text-5xl font-bold text-primary tracking-tight leading-tight mb-2">
                        Client Registry
                    </h1>
                    <p className="font-serif text-lg text-secondary italic leading-relaxed opacity-90">
                        The archives of souls and their celestial blueprints.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new" className="px-8 py-4 bg-gradient-to-r from-gold-primary to-gold-dark text-white rounded-2xl font-sans text-xs font-bold uppercase tracking-wider shadow-button hover:scale-105 transition-transform border border-white/10 leading-compact">
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
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 className="w-10 h-10 text-gold-primary animate-spin mb-4" />
                        <p className="font-serif text-base text-secondary leading-relaxed">Accessing Soul Archives...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-32 rounded-3xl bg-red-50 border border-red-100">
                        <p className="font-serif text-xl text-red-600 leading-tight mb-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary underline decoration-gold-primary decoration-2 underline-offset-4 hover:text-accent-gold leading-compact"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Client List */}
                {!loading && !error && filteredClients.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredClients.map(client => (
                            <ClientListRow key={client.id} client={client} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredClients.length === 0 && (
                    <div className="text-center py-32 rounded-3xl bg-softwhite border border-antique">
                        <p className="font-serif text-2xl italic text-muted-refined leading-relaxed">
                            No constellations match your search.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination / Total Count Footer */}
            {!loading && !error && (
                <div className="pt-8 border-t border-divider text-center">
                    <span className="font-sans text-xs text-secondary font-semibold uppercase tracking-wider leading-compact">
                        Synchronized with {filteredClients.length} Collective Records
                    </span>
                </div>
            )}
        </div>
    );
}
