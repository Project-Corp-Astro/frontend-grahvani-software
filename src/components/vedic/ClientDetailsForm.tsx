"use client";

import React, { useState } from "react";
import { useVedicClient, VedicClientDetails } from "@/context/VedicClientContext";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import GoldenButton from "@/components/GoldenButton";

export default function ClientDetailsForm({ onSuccess }: { onSuccess?: () => void }) {
    const { setClientDetails, clientDetails } = useVedicClient();
    const [formData, setFormData] = useState<VedicClientDetails>(
        clientDetails || {
            name: "",
            gender: "male",
            dateOfBirth: "",
            timeOfBirth: "",
            placeOfBirth: { city: "" },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientDetails(formData);
        if (onSuccess) onSuccess();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl border border-[#D08C60]/30 bg-gradient-to-br from-[#2A1810] to-[#1F120D] shadow-2xl relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D08C60]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D08C60]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                <h2 className="text-3xl font-serif text-[#FEFAEA] mb-2 text-center">
                    {clientDetails ? "Refine Cosmic Profile" : "Initiate New Reading"}
                </h2>
                <p className="text-[#FEFAEA]/60 text-center mb-8 font-light">
                    {clientDetails ? "Update spiritual coordinates for the active session" : "Enter birth details for Vedic chart analysis"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="group">
                            <label className="block text-xs font-bold text-[#D08C60] uppercase tracking-widest mb-2 ml-1">Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D08C60]/50 group-focus-within:text-[#D08C60]" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#1A0F0A] border border-[#D08C60]/20 rounded-xl py-3 pl-11 pr-4 text-[#FEFAEA] placeholder:text-[#FEFAEA]/20 focus:outline-none focus:border-[#D08C60] focus:ring-1 focus:ring-[#D08C60]/50 transition-all font-serif"
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date of Birth */}
                            <div className="group">
                                <label className="block text-xs font-bold text-[#D08C60] uppercase tracking-widest mb-2 ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D08C60]/50 group-focus-within:text-[#D08C60]" />
                                    <input
                                        type="date"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full bg-[#1A0F0A] border border-[#D08C60]/20 rounded-xl py-3 pl-11 pr-4 text-[#FEFAEA] placeholder:text-[#FEFAEA]/20 focus:outline-none focus:border-[#D08C60] focus:ring-1 focus:ring-[#D08C60]/50 transition-all font-serif [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Time of Birth */}
                            <div className="group">
                                <label className="block text-xs font-bold text-[#D08C60] uppercase tracking-widest mb-2 ml-1">Time of Birth</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D08C60]/50 group-focus-within:text-[#D08C60]" />
                                    <input
                                        type="time"
                                        required
                                        value={formData.timeOfBirth}
                                        onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                                        className="w-full bg-[#1A0F0A] border border-[#D08C60]/20 rounded-xl py-3 pl-11 pr-4 text-[#FEFAEA] placeholder:text-[#FEFAEA]/20 focus:outline-none focus:border-[#D08C60] focus:ring-1 focus:ring-[#D08C60]/50 transition-all font-serif [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Place of Birth */}
                        <div className="group">
                            <label className="block text-xs font-bold text-[#D08C60] uppercase tracking-widest mb-2 ml-1">Place of Birth</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D08C60]/50 group-focus-within:text-[#D08C60]" />
                                <input
                                    type="text"
                                    required
                                    value={formData.placeOfBirth.city}
                                    onChange={(e) => setFormData({ ...formData, placeOfBirth: { ...formData.placeOfBirth, city: e.target.value } })}
                                    className="w-full bg-[#1A0F0A] border border-[#D08C60]/20 rounded-xl py-3 pl-11 pr-4 text-[#FEFAEA] placeholder:text-[#FEFAEA]/20 focus:outline-none focus:border-[#D08C60] focus:ring-1 focus:ring-[#D08C60]/50 transition-all font-serif"
                                    placeholder="Enter city (e.g. New Delhi, India)"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="group">
                            <label className="block text-xs font-bold text-[#D08C60] uppercase tracking-widest mb-2 ml-1">Gender</label>
                            <div className="flex gap-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <label key={g} className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-full text-center py-3 rounded-xl border border-[#D08C60]/20 text-[#FEFAEA]/70 hover:bg-[#D08C60]/10 peer-checked:bg-[#D08C60] peer-checked:text-[#2A1810] peer-checked:font-bold transition-all font-serif capitalize">
                                            {g}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-8">
                        <GoldenButton
                            topText={clientDetails ? "Apply" : "Generate"}
                            bottomText={clientDetails ? "Changes" : "Chart"}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
