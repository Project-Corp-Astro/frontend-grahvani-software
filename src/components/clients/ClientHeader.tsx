import React from 'react';
import { Settings, PlusCircle, Pencil } from 'lucide-react';
import GoldenButton from "@/components/GoldenButton";
import { Client } from '@/types/client';

interface ClientHeaderProps {
    client: Client;
}

export default function ClientHeader({ client }: ClientHeaderProps) {
    return (
        <div className="bg-[#FEFAEA] border-b border-[#E7D6B8] pt-6 pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Row: Name & Main Actions */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#3E2A1F] mb-1">
                            {client.firstName} {client.lastName}
                        </h1>
                        <p className="font-serif text-[#7A5A43] italic flex items-center gap-2">
                            <span>{new Date(client.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="w-1 h-1 rounded-full bg-[#DCC9A6]" />
                            <span>{client.timeOfBirth}</span>
                            <span className="w-1 h-1 rounded-full bg-[#DCC9A6]" />
                            <span>{client.placeOfBirth}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-[#7A5A43] hover:text-[#9C7A2F] hover:bg-[#FAF5E6] rounded-full transition-colors" title="Edit Profile">
                            <Pencil className="w-5 h-5" />
                        </button>
                        <GoldenButton
                            topText="New"
                            bottomText="Session"
                            className="h-[40px] px-6 text-sm min-w-[140px]"
                        />
                    </div>
                </div>

                {/* Summary Cards Row (Rashi, Nakshatra, etc.) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Card 1: Rashi */}
                    <div className="bg-[#FAF5E6] border border-[#E7D6B8] rounded p-3 flex flex-col">
                        <span className="text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest">Moon Sign (Rashi)</span>
                        <span className="font-serif text-lg font-bold text-[#3E2A1F] mt-1">{client.rashi}</span>
                    </div>

                    {/* Card 2: Nakshatra */}
                    <div className="bg-[#FAF5E6] border border-[#E7D6B8] rounded p-3 flex flex-col">
                        <span className="text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest">Nakshatra</span>
                        <span className="font-serif text-lg font-bold text-[#3E2A1F] mt-1">{client.nakshatra || "Unknown"}</span>
                    </div>

                    {/* Card 3: Ascendant */}
                    <div className="bg-[#FAF5E6] border border-[#E7D6B8] rounded p-3 flex flex-col">
                        <span className="text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest">Ascendant</span>
                        <span className="font-serif text-lg font-bold text-[#3E2A1F] mt-1">Cancer</span>
                    </div>

                    {/* Card 4: Current Dasha */}
                    <div className="bg-[#FAF5E6] border border-[#E7D6B8] rounded p-3 flex flex-col">
                        <span className="text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest">Current Dasha</span>
                        <span className="font-serif text-lg font-bold text-[#3E2A1F] mt-1">Jup - Sat</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
