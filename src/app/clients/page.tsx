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
        <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#3E2A1F] mb-1">
                        Client Registry
                    </h1>
                    <p className="font-serif text-[#7A5A43] italic">
                        The records of souls and their cosmic journeys.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new">
                        <GoldenButton topText="Add New" bottomText="Client" className="h-[48px] min-w-[200px] text-lg" />
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-[#FEFAEA]/80 backdrop-blur-sm p-6 rounded-lg border border-[#E7D6B8] shadow-sm mb-8">
                <ParchmentInput
                    placeholder="Search by name, city..."
                    icon={<Search className="w-5 h-5" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Client List */}
            <div className="space-y-1">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <ClientListRow key={client.id} client={client} />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-60">
                        <p className="font-serif text-xl italic text-[#7A5A43]">
                            No stars align with your search.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination / Total Count Footer */}
            <div className="mt-8 text-center">
                <span className="font-serif text-sm text-[#7A5A43] uppercase tracking-widest">
                    Showing {filteredClients.length} Profiles
                </span>
            </div>
        </div>
    );
}
