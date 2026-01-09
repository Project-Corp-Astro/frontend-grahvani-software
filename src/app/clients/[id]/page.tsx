"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_CLIENTS } from "@/data/mockClients";
import ClientProfileSidebar from "@/components/clients/ClientProfileSidebar";
import { Sparkles, Calendar, Clock, MapPin, User, Mail, Phone, Heart, Plus, Search, X, ChevronRight, StickyNote } from 'lucide-react';
import { Client } from '@/types/client';
import Link from 'next/link';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;
    const client = MOCK_CLIENTS.find(c => c.id === clientId);

    const [activeTab, setActiveTab] = useState("profile");

    // --- LOGIC MOVED FROM SIDEBAR ---
    const [relationships, setRelationships] = useState<Client[]>([]);
    const [isAddingRel, setIsAddingRel] = useState(false);
    const [searchRel, setSearchRel] = useState("");
    const [notes, setNotes] = useState("");

    const availableRelations = MOCK_CLIENTS.filter(c =>
        client && c.id !== client.id &&
        !relationships.find(r => r.id === c.id) &&
        (c.firstName.toLowerCase().includes(searchRel.toLowerCase()) ||
            c.lastName.toLowerCase().includes(searchRel.toLowerCase()))
    );

    const addRelationship = (newRel: Client) => {
        setRelationships([...relationships, newRel]);
        setIsAddingRel(false);
        setSearchRel("");
    };
    // -------------------------------

    if (!client) return null; // Or loading/error state

    return (
        <div className="fixed inset-0 pt-[64px] flex animate-in fade-in duration-500 bg-parchment">

            {/* 1. Sidebar (Menu) */}
            <ClientProfileSidebar
                client={client}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* 2. Main Content Area */}
            <main className="flex-1 relative overflow-y-auto p-12 custom-scrollbar">
                {/* Background FX - Subtle Watermark */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />

                {/* CONTENT SWITCHER */}
                <div className="max-w-4xl mx-auto min-h-full relative z-10">

                    {/* Header for every tab */}
                    <div className="mb-10">
                        <span className="text-gold-dark text-xs font-black uppercase tracking-[0.2em] mb-2 block">
                            Active Module
                        </span>
                        <h1 className="text-4xl font-serif text-ink font-bold capitalize">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    {/* --- PROFILE DETAILS TAB --- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Personal Card */}
                            <div className="bg-parchment border border-antique rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-serif text-ink mb-6 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-white/50 rounded-lg border border-antique">
                                        <User className="w-5 h-5 text-gold-dark" />
                                    </div>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailItem label="Full Name" value={`${client.firstName} ${client.lastName}`} />
                                    <DetailItem label="Date of Birth" value={new Date(client.dateOfBirth).toLocaleDateString()} />
                                    <DetailItem label="Time of Birth" value={client.timeOfBirth || "Unknown"} />
                                    <DetailItem label="Place of Birth" value={client.placeOfBirth} />
                                    <DetailItem label="Gender" value={"Male"} />
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Tags</p>
                                        <div className="flex gap-2">
                                            {client.tags?.map(t => (
                                                <span key={t} className="px-3 py-1 rounded-full bg-white border border-antique text-gold-dark text-xs font-bold">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-parchment border border-antique rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-serif text-ink mb-6 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-white/50 rounded-lg border border-antique">
                                        <Phone className="w-5 h-5 text-gold-dark" />
                                    </div>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailItem label="Email Address" value={client.email || "N/A"} />
                                    <DetailItem label="Phone Number" value={client.phone || "N/A"} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RELATIONSHIPS TAB --- */}
                    {activeTab === 'relationships' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-muted">Manage known connections for this soul record.</p>
                                <button
                                    onClick={() => setIsAddingRel(!isAddingRel)}
                                    className="px-6 py-3 bg-gold-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-button"
                                >
                                    <Plus className="w-4 h-4" /> Add Connection
                                </button>
                            </div>

                            {/* Add Area */}
                            {isAddingRel && (
                                <div className="mb-8 p-6 bg-parchment rounded-2xl border border-antique relative overflow-hidden shadow-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-ink font-serif font-bold">Search Archives</h4>
                                        <button onClick={() => setIsAddingRel(false)} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Type name..."
                                            value={searchRel}
                                            onChange={(e) => setSearchRel(e.target.value)}
                                            autoFocus
                                            className="w-full bg-white border border-antique rounded-xl py-3 pl-12 pr-4 text-ink placeholder:text-muted focus:outline-none focus:border-gold-primary"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availableRelations.map(rel => (
                                            <button
                                                key={rel.id}
                                                onClick={() => addRelationship(rel)}
                                                className="w-full flex items-center gap-4 p-3 hover:bg-white/50 rounded-xl transition-colors text-left border border-transparent hover:border-antique"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-softwhite flex items-center justify-center text-gold-dark border border-antique font-serif font-bold">
                                                    {rel.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-ink font-bold">{rel.firstName} {rel.lastName}</p>
                                                    <p className="text-muted text-xs">{rel.placeOfBirth}</p>
                                                </div>
                                                <div className="ml-auto text-gold-dark text-xs font-bold uppercase tracking-wider">Select</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* List Area */}
                            <div className="grid grid-cols-1 gap-4">
                                {relationships.length > 0 ? (
                                    relationships.map(rel => (
                                        <div key={rel.id} className="flex items-center p-6 bg-parchment border border-antique rounded-2xl group hover:shadow-card transition-all">
                                            <div className="w-16 h-16 rounded-full bg-softwhite flex items-center justify-center text-xl font-serif text-ink border border-antique mr-6 shadow-sm">
                                                {rel.firstName[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-serif text-ink group-hover:text-gold-dark transition-colors">{rel.firstName} {rel.lastName}</h3>
                                                <p className="text-muted text-sm mt-1">{rel.placeOfBirth} • Soul Record #{rel.id}</p>
                                            </div>
                                            <Link href={`/clients/${rel.id}`} className="px-6 py-2 rounded-full border border-antique text-gold-dark text-xs font-bold uppercase tracking-widest hover:bg-gold-primary hover:text-white transition-all">
                                                View
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-antique/50 rounded-3xl bg-parchment/30">
                                        <Heart className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                        <p className="text-muted font-serif text-lg">No relationships mapped yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- NOTES TAB --- */}
                    {activeTab === 'notes' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 h-[600px] flex flex-col">
                            <div className="bg-parchment rounded-3xl flex-1 p-10 relative shadow-2xl relative border border-antique">
                                {/* Paper Texture / Lines */}
                                <div className="absolute inset-0 pointer-events-none opacity-50"
                                    style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #D08C6020 32px)' }}
                                />
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#000000]/5 rounded-bl-3xl z-10" />

                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Begin writing your observations..."
                                    className="w-full h-full bg-transparent resize-none focus:outline-none font-serif text-xl text-ink leading-[32px] relative z-20 placeholder:text-muted/30"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- CONSULTATIONS TAB (Placeholder) --- */}
                    {activeTab === 'consultations' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-parchment border border-antique rounded-3xl p-8 text-center py-20 shadow-sm">
                                <Clock className="w-12 h-12 text-gold-dark mx-auto mb-4" />
                                <h3 className="text-2xl font-serif text-ink mb-2">History Log</h3>
                                <p className="text-muted">Consultation history module coming soon.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">{label}</p>
            <p className="text-lg font-serif text-ink font-medium border-b border-antique pb-2">{value}</p>
        </div>
    );
}
