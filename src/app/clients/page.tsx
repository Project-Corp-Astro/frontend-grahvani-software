"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import GoldenButton from "@/components/GoldenButton";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { Client, ClientListResponse } from "@/types/client";
import { clientApi } from "@/lib/api";
import { useRouter } from 'next/navigation';
import { useClients } from "@/hooks/queries/useClients";
import { useClientMutations } from "@/hooks/mutations/useClientMutations";

// Helper to derive firstName/lastName from fullName for display
const deriveNames = (client: Client): Client => {
    if (client.firstName && client.lastName) return client;
    if (client.fullName) {
        const parts = client.fullName.split(' ');
        return {
            ...client,
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            // Backwards compatibility
            placeOfBirth: client.birthPlace || client.placeOfBirth,
            dateOfBirth: client.birthDate || client.dateOfBirth,
            timeOfBirth: client.birthTime || client.timeOfBirth,
            phone: client.phonePrimary || client.phone,
        };
    }
    return client;
};

export default function ClientsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    // Query Hooks
    const { data, isLoading: loading, error: queryError, refetch } = useClients({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
    });

    const { deleteClient } = useClientMutations();

    // Derived State
    const clients = data?.clients?.map(deriveNames) || [];
    const total = data?.pagination?.total || 0;
    const totalPages = data?.pagination?.totalPages || 1;
    const error = queryError ? (queryError as Error).message : null;

    // Handle Editing
    const handleEditClient = (client: Client) => {
        router.push(`/clients/${client.id}`);
    };

    // Handle Deletion
    const handleDeleteClient = async (client: Client) => {
        const confirmed = window.confirm(`Are you certain you wish to purge the record of ${client.firstName || client.fullName || 'this soul'}? This action cannot be undone.`);

        if (!confirmed) return;

        try {
            await deleteClient.mutateAsync(client.id);
            // Refetch is automatic via invalidation in hook
        } catch (err: any) {
            console.error('Failed to delete client:', err);
            alert(err.message || 'Failed to delete client record. Please try again.');
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700 py-4 px-2 lg:px-4">
            <div className="text-xs font-serif uppercase tracking-widest font-bold text-[#6B4423]">
                Client Almanac
            </div>
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
                    <Link href="/clients/new">
                        <GoldenButton
                            topText="Add New"
                            bottomText="Soul"
                        />
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

                {/* Offline/Error indicator */}
                {error && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-1 text-amber-700 hover:text-amber-800 text-sm font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Client List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-32 rounded-3xl bg-softwhite border border-antique">
                        <Loader2 className="w-8 h-8 text-gold-primary mx-auto mb-4 animate-spin" />
                        <p className="font-serif text-xl text-muted">Loading soul records...</p>
                    </div>
                ) : clients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {clients.map(client => (
                            <ClientListRow
                                key={client.id}
                                client={client}
                                onSelect={(c) => router.push(`/clients/${c.id}`)}
                                onEdit={handleEditClient}
                                onDelete={handleDeleteClient}
                            />
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
                    Synchronized with {total} Collective Records
                    {totalPages > 1 && (
                        <span className="ml-2">• Page {pagination.page} of {totalPages}</span>
                    )}
                </span>
            </div>
        </div>
    );
}
