"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_CLIENTS } from "@/data/mockClients";
import ClientProfileSidebar from "@/components/clients/ClientProfileSidebar";
import { Sparkles, Calendar, Clock, MapPin, User, Mail, Phone, Heart, Plus, Search, X, ChevronRight, StickyNote, Save, Edit2 } from 'lucide-react';
import { Client } from '@/types/client';
import Link from 'next/link';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;
    const client = MOCK_CLIENTS.find(c => c.id === clientId);

    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);

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

                    {/* --- BIRTH DETAILS TAB --- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-5 py-2.5 bg-parchment border border-antique text-muted rounded-lg font-medium text-sm hover:bg-softwhite transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Save logic here
                                                setIsEditing(false);
                                            }}
                                            className="px-5 py-2.5 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-5 py-2.5 bg-softwhite border border-antique text-ink rounded-lg font-medium text-sm hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Details
                                    </button>
                                )}
                            </div>

                            {/* Personal Details Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="text-lg font-serif text-ink mb-5 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-parchment rounded-lg border border-antique">
                                        <User className="w-4 h-4 text-gold-dark" />
                                    </div>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <DetailItem label="Full Name" value={`${client.firstName} ${client.lastName}`} isEditing={isEditing} />
                                    <DetailItem label="Gender" value={"Male"} isEditing={isEditing} />
                                    <DetailItem label="Date of Birth" value={new Date(client.dateOfBirth).toLocaleDateString()} isEditing={isEditing} />
                                    <DetailItem label="Time of Birth" value={client.timeOfBirth || "Unknown"} isEditing={isEditing} />
                                </div>
                            </div>

                            {/* Birth Location Card - Critical for astrology */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="text-lg font-serif text-ink mb-5 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-parchment rounded-lg border border-antique">
                                        <MapPin className="w-4 h-4 text-gold-dark" />
                                    </div>
                                    Birth Location
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <DetailItem label="Place of Birth" value={client.placeOfBirth} isEditing={isEditing} />
                                    </div>
                                    <DetailItem label="Latitude" value={"28.6139° N"} isEditing={isEditing} />
                                    <DetailItem label="Longitude" value={"77.2090° E"} isEditing={isEditing} />
                                    <DetailItem label="Timezone" value={"IST (UTC +5:30)"} isEditing={isEditing} />
                                    <DetailItem label="DST Applied" value={"No"} isEditing={isEditing} />
                                </div>
                            </div>

                            {/* Astrological Signature Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="text-lg font-serif text-ink mb-5 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-parchment rounded-lg border border-antique">
                                        <Sparkles className="w-4 h-4 text-gold-dark" />
                                    </div>
                                    Astrological Signature
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <DetailItem label="Rashi (Moon Sign)" value={client.rashi || "Leo"} isEditing={isEditing} />
                                    <DetailItem label="Nakshatra" value={client.nakshatra || "Magha"} isEditing={isEditing} />
                                    <DetailItem label="Pada" value={"3"} isEditing={isEditing} />
                                    <DetailItem label="Lagna (Ascendant)" value={"Scorpio"} isEditing={isEditing} />
                                    <DetailItem label="Lagna Lord" value={"Mars"} isEditing={isEditing} />
                                    <DetailItem label="Nakshatra Lord" value={"Ketu"} isEditing={isEditing} />
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="text-lg font-serif text-ink mb-5 flex items-center gap-3 font-semibold">
                                    <div className="p-2 bg-parchment rounded-lg border border-antique">
                                        <Phone className="w-4 h-4 text-gold-dark" />
                                    </div>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <DetailItem label="Email Address" value={client.email || "N/A"} isEditing={isEditing} />
                                    <DetailItem label="Phone Number" value={client.phone || "N/A"} isEditing={isEditing} />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="text-lg font-serif text-ink mb-4 font-semibold">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {client.tags?.map(t => (
                                        <span key={t} className="px-3 py-1.5 rounded-full bg-parchment border border-antique text-gold-dark text-xs font-bold">{t}</span>
                                    ))}
                                    {isEditing && (
                                        <button className="px-3 py-1.5 rounded-full border border-dashed border-gold-primary/50 text-gold-primary text-xs font-bold hover:bg-gold-primary/10 transition-colors">
                                            + Add Tag
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- FAMILY LINKS TAB --- */}
                    {activeTab === 'family' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-muted">Manage known connections for this soul record.</p>
                                <button
                                    onClick={() => setIsAddingRel(!isAddingRel)}
                                    className="px-5 py-2.5 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Connection
                                </button>
                            </div>

                            {/* Add Area */}
                            {isAddingRel && (
                                <div className="mb-6 p-5 bg-softwhite rounded-xl border border-antique">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-ink font-serif font-bold">Search Archives</h4>
                                        <button onClick={() => setIsAddingRel(false)} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-3 w-4 h-4 text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Type name..."
                                            value={searchRel}
                                            onChange={(e) => setSearchRel(e.target.value)}
                                            autoFocus
                                            className="w-full bg-parchment border border-antique rounded-lg py-2.5 pl-10 pr-4 text-ink text-sm placeholder:text-muted focus:outline-none focus:border-gold-primary"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {availableRelations.map(rel => (
                                            <button
                                                key={rel.id}
                                                onClick={() => addRelationship(rel)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-parchment rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-dark font-serif font-bold text-sm">
                                                    {rel.firstName[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-ink font-medium text-sm">{rel.firstName} {rel.lastName}</p>
                                                    <p className="text-muted text-xs">{rel.placeOfBirth}</p>
                                                </div>
                                                <span className="text-gold-dark text-xs font-medium">Select</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* List Area */}
                            <div className="space-y-3">
                                {relationships.length > 0 ? (
                                    relationships.map(rel => (
                                        <div key={rel.id} className="flex items-center p-5 bg-softwhite border border-antique rounded-xl hover:border-gold-primary/50 transition-all">
                                            <div className="w-12 h-12 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif text-lg text-gold-dark mr-4">
                                                {rel.firstName[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-serif font-bold text-ink">{rel.firstName} {rel.lastName}</h3>
                                                <p className="text-muted text-sm">{rel.placeOfBirth}</p>
                                            </div>
                                            <Link href={`/clients/${rel.id}`} className="px-4 py-2 rounded-lg border border-antique text-gold-dark text-xs font-semibold hover:bg-gold-primary hover:text-white transition-all">
                                                View Chart
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 border border-dashed border-antique rounded-xl bg-parchment/30">
                                        <Heart className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                                        <p className="text-muted font-serif">No family connections mapped yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- SESSION NOTES TAB --- */}
                    {activeTab === 'notes' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-softwhite rounded-xl border border-antique p-6 min-h-[500px]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-serif font-bold text-ink">Quick Notes</h3>
                                    <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Write your observations, notes, and reminders for this client..."
                                    className="w-full h-[400px] bg-parchment border border-antique rounded-lg p-4 resize-none focus:outline-none focus:border-gold-primary font-serif text-ink leading-relaxed placeholder:text-muted/50"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- PAST SESSIONS TAB --- */}
                    {activeTab === 'sessions' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                            {[
                                { id: 1, date: "2026-01-05", topic: "Career Guidance", notes: "Discussed job change during Saturn Antardasha", duration: "45 min" },
                                { id: 2, date: "2025-11-20", topic: "Marriage Timing", notes: "Favorable periods in 2026 identified", duration: "30 min" },
                                { id: 3, date: "2025-09-15", topic: "Health Concerns", notes: "Rahu transit impact on 6th house reviewed", duration: "40 min" },
                            ].map(session => (
                                <div key={session.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-serif font-bold text-ink">{session.topic}</h3>
                                            <p className="text-xs text-muted flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3" /> {session.date} • {session.duration}
                                            </p>
                                        </div>
                                        <button className="text-xs text-gold-dark font-medium hover:underline">View Full</button>
                                    </div>
                                    <p className="text-sm text-body">{session.notes}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- PREDICTIONS MADE TAB --- */}
                    {activeTab === 'predictions' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                            <div className="flex items-center justify-end mb-2">
                                <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Prediction
                                </button>
                            </div>
                            {[
                                { id: 1, date: "2026-01-05", prediction: "Job change expected by Feb 2025", status: "pending", category: "Career" },
                                { id: 2, date: "2025-11-20", prediction: "Marriage likely between June-August 2026", status: "pending", category: "Marriage" },
                                { id: 3, date: "2025-09-15", prediction: "Health improvement after Oct 2025", status: "verified", category: "Health" },
                            ].map(pred => (
                                <div key={pred.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-gold-primary/10 text-gold-dark rounded">{pred.category}</span>
                                                <span className="text-xs text-muted">{pred.date}</span>
                                            </div>
                                            <p className="font-medium text-ink">{pred.prediction}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${pred.status === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                                            {pred.status === 'verified' ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- REMEDIES GIVEN TAB --- */}
                    {activeTab === 'remedies' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                            <div className="flex items-center justify-end mb-2">
                                <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Remedy
                                </button>
                            </div>
                            {[
                                { id: 1, date: "2026-01-05", remedy: "Blue Sapphire (Neelam)", type: "Gemstone", status: "active", notes: "Wear on Saturday morning after puja" },
                                { id: 2, date: "2025-11-20", remedy: "Shani Mantra - 23,000 Japa", type: "Mantra", status: "completed", notes: "Complete within 40 days" },
                                { id: 3, date: "2025-09-15", remedy: "Donate black sesame on Saturdays", type: "Donation", status: "ongoing", notes: "Every Saturday for 11 weeks" },
                            ].map(remedy => (
                                <div key={remedy.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-gold-primary/10 text-gold-dark rounded">{remedy.type}</span>
                                            </div>
                                            <h3 className="font-serif font-bold text-ink">{remedy.remedy}</h3>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${remedy.status === 'completed' ? 'bg-green-50 text-green-700' : remedy.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {remedy.status.charAt(0).toUpperCase() + remedy.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted">{remedy.notes}</p>
                                    <p className="text-xs text-muted mt-2">Prescribed: {remedy.date}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- DOCUMENTS TAB --- */}
                    {activeTab === 'documents' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-end mb-4">
                                <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Upload Document
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 1, name: "Birth Chart Analysis.pdf", date: "2026-01-05", size: "245 KB" },
                                    { id: 2, name: "Yearly Prediction 2026.pdf", date: "2025-12-20", size: "180 KB" },
                                    { id: 3, name: "Marriage Compatibility.pdf", date: "2025-11-15", size: "320 KB" },
                                ].map(doc => (
                                    <div key={doc.id} className="bg-softwhite border border-antique rounded-xl p-4 hover:border-gold-primary/50 transition-colors group cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                <StickyNote className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-ink text-sm truncate group-hover:text-gold-dark">{doc.name}</h4>
                                                <p className="text-xs text-muted mt-1">{doc.date} • {doc.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Empty State */}
                            <div className="mt-4 text-center py-12 border border-dashed border-antique rounded-xl bg-parchment/30">
                                <StickyNote className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                                <p className="text-muted font-serif text-sm">Drop files here or click Upload</p>
                            </div>
                        </div>
                    )}

                    {/* --- PAYMENT HISTORY TAB --- */}
                    {activeTab === 'payments' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-softwhite border border-antique rounded-xl p-4">
                                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Paid</p>
                                    <p className="text-xl font-serif font-bold text-ink">₹8,500</p>
                                </div>
                                <div className="bg-softwhite border border-antique rounded-xl p-4">
                                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Pending</p>
                                    <p className="text-xl font-serif font-bold text-orange-600">₹0</p>
                                </div>
                                <div className="bg-softwhite border border-antique rounded-xl p-4">
                                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Sessions</p>
                                    <p className="text-xl font-serif font-bold text-ink">5</p>
                                </div>
                            </div>

                            {/* Payment List */}
                            <div className="space-y-3">
                                {[
                                    { id: 1, date: "2026-01-05", amount: 2500, type: "Consultation Fee", method: "UPI", status: "paid" },
                                    { id: 2, date: "2025-11-20", amount: 3500, type: "Full Chart Analysis", method: "Card", status: "paid" },
                                    { id: 3, date: "2025-09-15", amount: 2500, type: "Follow-up Session", method: "Cash", status: "paid" },
                                ].map(payment => (
                                    <div key={payment.id} className="bg-softwhite border border-antique rounded-xl p-4 flex items-center justify-between hover:border-gold-primary/50 transition-colors">
                                        <div>
                                            <p className="font-medium text-ink">{payment.type}</p>
                                            <p className="text-xs text-muted mt-1">{payment.date} • {payment.method}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-serif font-bold text-ink">₹{payment.amount.toLocaleString()}</p>
                                            <span className="text-xs text-green-600 font-semibold">Paid</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function DetailItem({ label, value, isEditing = false }: { label: string, value: string, isEditing?: boolean }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">{label}</p>
            {isEditing ? (
                <input
                    type="text"
                    defaultValue={value}
                    className="w-full text-base font-serif text-ink font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                />
            ) : (
                <p className="text-base font-serif text-ink font-medium border-b border-antique pb-2">{value}</p>
            )}
        </div>
    );
}
