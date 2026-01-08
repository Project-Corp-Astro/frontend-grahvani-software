"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';
import GoldenButton from "@/components/GoldenButton";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import ParchmentDatePicker from "@/components/ui/ParchmentDatePicker";
import ParchmentTimePicker from "@/components/ui/ParchmentTimePicker";

export default function ClientForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'female',

        // Date Objects
        dateOfBirth: undefined as Date | undefined,
        timeOfBirth: undefined as Date | undefined, // Just for holding time

        city: '',
        country: '',
        timezone: ''
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload
        const payload = {
            ...formData,
            // Format dates for API if needed
            dob: formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : null,
            tob: formData.timeOfBirth ? format(formData.timeOfBirth, 'HH:mm') : null
        };

        console.log("Saving client:", payload);

        setTimeout(() => {
            setLoading(false);
            router.push('/clients');
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">

            {/* 1. Personal Details Section */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[#DCC9A6]">
                    <User className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-xl font-bold text-[#3E2A1F]">Personal Identity</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <ParchmentInput
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    <ParchmentInput
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ParchmentSelect
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        options={[
                            { value: 'female', label: 'Female' },
                            { value: 'male', label: 'Male' },
                            { value: 'other', label: 'Other' }
                        ]}
                    />
                    {/* Relationship field could go here */}
                </div>
            </div>

            {/* 2. Birth Data Section */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[#DCC9A6]">
                    <Calendar className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-xl font-bold text-[#3E2A1F]">Cosmic Snapshot (Birth Data)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Date of Birth */}
                    <ParchmentDatePicker
                        label="Date of Birth"
                        placeholder="Select Birth Date"
                        date={formData.dateOfBirth}
                        setDate={(date) => handleChange('dateOfBirth', date)}
                    />

                    {/* Time of Birth */}
                    <ParchmentTimePicker
                        label="Time of Birth"
                        placeholder="Select Birth Time"
                        date={formData.timeOfBirth}
                        setDate={(date) => handleChange('timeOfBirth', date)}
                    />
                </div>

                {/* Place of Birth */}
                <div className="mb-8">
                    <label className="block text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest mb-3">
                        Place of Birth
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ParchmentInput
                            placeholder="City"
                            icon={<MapPin className="w-4 h-4" />}
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            required
                        />
                        <ParchmentInput
                            placeholder="Country"
                            icon={<Globe className="w-4 h-4" />}
                            value={formData.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-[#DCC9A6]">
                <div className="w-full md:w-auto">
                    <GoldenButton
                        topText={loading ? "Preserving" : "Save"}
                        bottomText={loading ? "Record..." : "Profile"}
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-[240px]"
                    />
                </div>
            </div>
        </form>
    );
}
