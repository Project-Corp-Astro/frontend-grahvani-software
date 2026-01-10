"use client";

import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Calendar, MapPin, Camera, Save, Loader2 } from 'lucide-react';
import GoldenButton from "@/components/GoldenButton";

export default function ProfilePage() {
    const { user, refreshProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-gold-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-12 flex items-end gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#98522F] to-[#763A1F] border-2 border-[#D08C60] shadow-2xl flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-serif text-white uppercase">{user.name?.[0] || user.email?.[0]}</span>
                        )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-[#D08C60]/20 flex items-center justify-center text-[#98522F] hover:bg-[#FEFAEA] transition-colors group-hover:scale-110 duration-300">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 pb-2">
                    <span className="text-[#D08C60] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Astrologer Identity</span>
                    <h1 className="text-4xl font-serif font-bold text-ink leading-none">{user.name || 'Seeker'}</h1>
                    <p className="text-muted font-serif italic mt-2">{user.email}</p>
                </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Essential Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-softwhite border border-antique rounded-2xl p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D08C60]/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <h2 className="text-xl font-serif font-bold text-ink mb-8 flex items-center gap-3">
                            <User className="w-5 h-5 text-[#D08C60]" />
                            Profile Details
                        </h2>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileItem label="Display Name" value={user.name} />
                                <ProfileItem label="Role" value={user.role || 'Senior Astrologer'} icon={<Shield className="w-3 h-3" />} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileItem label="Primary Email" value={user.email} />
                                <ProfileItem label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Ancient Times'} />
                            </div>

                            <div className="pt-4">
                                <ProfileItem label="Bio / Professional Philosophy" value="Dedicated to exploring the celestial alignments that guide human destiny through the ancient wisdom of Vedic Astrology." fullWidth />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#98522F] to-[#763A1F] rounded-2xl p-6 text-white shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD27D] mb-4">Account Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-medium">Verified Astronomer</span>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed font-serif italic">
                            Your celestial credentials are fully verified. All predictions made are cryptographically signed.
                        </p>
                    </div>

                    <div className="bg-white border border-antique rounded-2xl p-6 space-y-4">
                        <GoldenButton
                            topText="Update"
                            bottomText="Journal"
                            onClick={() => { }}
                            className="w-full"
                        />
                        <button className="w-full py-3 rounded-xl border border-divider text-muted text-xs font-bold uppercase tracking-wider hover:bg-parchment transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`mt-8 p-4 rounded-xl text-center text-sm font-medium animate-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

function ProfileItem({ label, value, icon, fullWidth = false }: { label: string, value?: string, icon?: React.ReactNode, fullWidth?: boolean }) {
    return (
        <div className={fullWidth ? "col-span-full" : ""}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D08C60] mb-2 flex items-center gap-2">
                {label}
                {icon}
            </p>
            <p className="text-ink font-serif text-lg border-b border-antique pb-2">
                {value || 'Not provided'}
            </p>
        </div>
    );
}
