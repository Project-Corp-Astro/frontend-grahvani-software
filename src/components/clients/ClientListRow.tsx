import React from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientListRowProps {
    client: Client;
}

export default function ClientListRow({ client }: ClientListRowProps) {
    return (
        <div className="group relative">
            <Link href={`/client/${client.id}`}>
                <div className="
                    relative flex items-center p-4 mb-3
                    bg-[#FEFAEA] border border-[#E7D6B8] rounded-[4px]
                    transition-all duration-300
                    hover:shadow-[0_4px_15px_rgba(62,42,31,0.1)]
                    hover:border-[#C9A24D]
                    cursor-pointer
                ">
                    {/* 1. Avatar / Photo */}
                    <div className="relative mr-6">
                        <div className="w-16 h-16 rounded-full border-2 border-[#C9A24D] overflow-hidden shadow-sm bg-[#FAEFD8] flex items-center justify-center">
                            {client.avatar ? (
                                <img src={client.avatar} alt={client.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-serif text-2xl text-[#9C7A2F] font-bold">
                                    {client.firstName[0]}
                                </span>
                            )}
                        </div>
                        {/* Decorative 'gold-dot' frame accent if desired, simplified for now */}
                    </div>

                    {/* 2. Main Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-[#3E2A1F] group-hover:text-[#9C7A2F] transition-colors">
                                    {client.firstName} {client.lastName}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center text-[#7A5A43] text-sm font-medium">
                                        <MapPin className="w-3.5 h-3.5 mr-1 opacity-70" />
                                        {client.placeOfBirth}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[#DCC9A6]" />
                                    <div className="text-[#7A5A43] text-sm">
                                        {new Date(client.dateOfBirth).toLocaleDateString('en-US', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Right Side: Last Consulted & Actions (hidden by default) */}
                            <div className="flex items-center gap-6">
                                {client.lastConsulted && (
                                    <div className="text-right">
                                        <span className="block text-[10px] uppercase tracking-widest text-[#9C7A2F] font-bold">Last Consulted</span>
                                        <span className="text-sm font-serif text-[#5A3E2B]">
                                            {new Date(client.lastConsulted).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Floating Actions (Absolute position to not mess with layout, appear on hover) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                <button
                    className="p-2 rounded-full bg-[#FEFAEA] border border-[#E7D6B8] text-[#7A5A43] hover:text-[#3E2A1F] hover:border-[#C9A24D] shadow-sm transition-all"
                    title="Edit Client"
                    onClick={(e) => {
                        e.preventDefault(); // Stop Link propagation
                        console.log('Edit', client.id);
                    }}
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    className="p-2 rounded-full bg-[#FEFAEA] border border-[#E7D6B8] text-[#7A5A43] hover:text-red-700 hover:border-red-300 shadow-sm transition-all"
                    title="Delete Client"
                    onClick={(e) => {
                        e.preventDefault(); // Stop Link propagation
                        console.log('Delete', client.id);
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
