"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Calendar, Globe, Phone, Mail, Briefcase, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import GoldenButton from "@/components/GoldenButton";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import ParchmentDatePicker from "@/components/ui/ParchmentDatePicker";
import ParchmentTimePicker from "@/components/ui/ParchmentTimePicker";
import { clientApi, geocodeApi } from "@/lib/api";
import { LocationSuggestion, CreateClientPayload, Client } from "@/types/client";

interface ClientFormProps {
    mode?: 'create' | 'edit';
    initialData?: Client;
    onSuccess?: (client: Client) => void;
}

export default function ClientForm({ mode = 'create', initialData, onSuccess }: ClientFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Location Autocomplete State
    const [locationQuery, setLocationQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Form State - All fields for comprehensive client registration
    const [formData, setFormData] = useState({
        // Personal Identity
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        gender: initialData?.gender || 'female',

        // Contact Information
        email: initialData?.email || '',
        phonePrimary: initialData?.phonePrimary || initialData?.phone || '',
        phoneSecondary: initialData?.phoneSecondary || '',

        // Birth Details - Critical for Vedic chart calculations
        dateOfBirth: initialData?.birthDate ? new Date(initialData.birthDate) : undefined as Date | undefined,
        timeOfBirth: undefined as Date | undefined,
        birthPlace: initialData?.birthPlace || initialData?.placeOfBirth || '',
        birthLatitude: initialData?.birthLatitude || undefined as number | undefined,
        birthLongitude: initialData?.birthLongitude || undefined as number | undefined,
        birthTimezone: initialData?.birthTimezone || '',
        birthTimeAccuracy: initialData?.birthTimeAccuracy || 'exact' as 'exact' | 'approximate' | 'rectified' | 'unknown',

        // Personal Details
        maritalStatus: initialData?.maritalStatus || '' as '' | 'single' | 'married' | 'divorced' | 'widowed',
        occupation: initialData?.occupation || '',

        // Current Address
        city: initialData?.city || '',
        state: initialData?.state || '',
        country: initialData?.country || '',
    });

    // Parse initial birth time
    useEffect(() => {
        if (initialData?.birthTime) {
            const [hours, minutes] = initialData.birthTime.split(':').map(Number);
            const timeDate = new Date();
            timeDate.setHours(hours, minutes, 0, 0);
            setFormData(prev => ({ ...prev, timeOfBirth: timeDate }));
        }
        if (initialData?.birthPlace) {
            setLocationQuery(initialData.birthPlace);
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Debounced location search
    const searchLocations = useCallback(async (query: string) => {
        if (query.length < 2) {
            setLocationSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);
        try {
            const response = await geocodeApi.getSuggestions(query, 5);
            setLocationSuggestions(response.suggestions || []);
        } catch (err) {
            console.error('Failed to fetch location suggestions:', err);
            setLocationSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, []);

    // Location input debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (locationQuery.length >= 2) {
                searchLocations(locationQuery);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [locationQuery, searchLocations]);

    const selectLocation = (location: LocationSuggestion) => {
        setLocationQuery(location.formatted);
        setFormData(prev => ({
            ...prev,
            birthPlace: location.formatted,
            birthLatitude: location.latitude,
            birthLongitude: location.longitude,
            birthTimezone: location.timezone,
            city: location.city || '',
            country: location.country || '',
        }));
        setShowSuggestions(false);
        setLocationSuggestions([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Combine first and last name for backend
            const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

            // Prepare payload matching backend schema
            const payload: CreateClientPayload = {
                fullName,
                email: formData.email || undefined,
                phonePrimary: formData.phonePrimary || undefined,
                phoneSecondary: formData.phoneSecondary || undefined,

                // Birth details - crucial for astrology
                // Prisma expects ISO-8601 DateTime, so combine date and time
                birthDate: formData.dateOfBirth
                    ? new Date(
                        formData.dateOfBirth.getFullYear(),
                        formData.dateOfBirth.getMonth(),
                        formData.dateOfBirth.getDate(),
                        formData.timeOfBirth ? formData.timeOfBirth.getHours() : 0,
                        formData.timeOfBirth ? formData.timeOfBirth.getMinutes() : 0,
                        formData.timeOfBirth ? formData.timeOfBirth.getSeconds() : 0
                    ).toISOString()
                    : undefined,
                birthTime: formData.timeOfBirth ? format(formData.timeOfBirth, 'HH:mm:ss') : undefined,
                birthPlace: formData.birthPlace || undefined,
                birthLatitude: formData.birthLatitude,
                birthLongitude: formData.birthLongitude,
                birthTimezone: formData.birthTimezone || undefined,
                birthTimeAccuracy: formData.birthTimeAccuracy,

                // Personal details
                gender: formData.gender as 'male' | 'female' | 'other',
                maritalStatus: formData.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed' | undefined,
                occupation: formData.occupation || undefined,

                // Address
                city: formData.city || undefined,
                state: formData.state || undefined,
                country: formData.country || undefined,
            };

            let client: Client;

            if (mode === 'edit' && initialData?.id) {
                client = await clientApi.updateClient(initialData.id, payload);
            } else {
                client = await clientApi.createClient(payload);
            }

            console.log("Client saved:", client);

            if (onSuccess) {
                onSuccess(client);
            } else {
                router.push('/clients');
            }
        } catch (err: any) {
            console.error("Failed to save client:", err);
            setError(err.message || 'Failed to save client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* 1. Personal Identity Section */}
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
                    <ParchmentSelect
                        label="Marital Status"
                        value={formData.maritalStatus}
                        onChange={(e) => handleChange('maritalStatus', e.target.value)}
                        options={[
                            { value: '', label: 'Select Status' },
                            { value: 'single', label: 'Single' },
                            { value: 'married', label: 'Married' },
                            { value: 'divorced', label: 'Divorced' },
                            { value: 'widowed', label: 'Widowed' }
                        ]}
                    />
                </div>
            </div>

            {/* 2. Contact Information Section */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[#DCC9A6]">
                    <Phone className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-xl font-bold text-[#3E2A1F]">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <ParchmentInput
                        placeholder="Email Address"
                        type="email"
                        icon={<Mail className="w-4 h-4" />}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <ParchmentInput
                        placeholder="Primary Phone"
                        type="tel"
                        icon={<Phone className="w-4 h-4" />}
                        value={formData.phonePrimary}
                        onChange={(e) => handleChange('phonePrimary', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ParchmentInput
                        placeholder="Secondary Phone (Optional)"
                        type="tel"
                        icon={<Phone className="w-4 h-4" />}
                        value={formData.phoneSecondary}
                        onChange={(e) => handleChange('phoneSecondary', e.target.value)}
                    />
                    <ParchmentInput
                        placeholder="Occupation"
                        icon={<Briefcase className="w-4 h-4" />}
                        value={formData.occupation}
                        onChange={(e) => handleChange('occupation', e.target.value)}
                    />
                </div>
            </div>

            {/* 3. Birth Data Section - Critical for Astrology */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[#DCC9A6]">
                    <Calendar className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-xl font-bold text-[#3E2A1F]">Cosmic Snapshot (Birth Data)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <ParchmentDatePicker
                        label="Date of Birth"
                        placeholder="Select Birth Date"
                        date={formData.dateOfBirth}
                        setDate={(date) => handleChange('dateOfBirth', date)}
                    />
                    <ParchmentTimePicker
                        label="Time of Birth"
                        placeholder="Select Birth Time"
                        date={formData.timeOfBirth}
                        setDate={(date) => handleChange('timeOfBirth', date)}
                    />
                </div>

                {/* Birth Time Accuracy */}
                <div className="mb-8">
                    <ParchmentSelect
                        label="Birth Time Accuracy"
                        value={formData.birthTimeAccuracy}
                        onChange={(e) => handleChange('birthTimeAccuracy', e.target.value)}
                        options={[
                            { value: 'exact', label: 'Exact (From birth certificate)' },
                            { value: 'approximate', label: 'Approximate (Within ±30 mins)' },
                            { value: 'rectified', label: 'Rectified (Astrologically corrected)' },
                            { value: 'unknown', label: 'Unknown' }
                        ]}
                    />
                </div>

                {/* Birth Place with Autocomplete */}
                <div className="mb-8">
                    <label className="block text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest mb-3">
                        Place of Birth
                    </label>
                    <div className="relative">
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7A2F]" />
                            <input
                                type="text"
                                placeholder="Search city or town..."
                                value={locationQuery}
                                onChange={(e) => {
                                    setLocationQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className="w-full bg-[#FEFAEA] border border-[#DCC9A6] rounded-lg py-3 pl-12 pr-10 text-[#3E2A1F] font-serif placeholder:text-[#9C7A2F]/50 focus:outline-none focus:border-[#9C7A2F] transition-colors"
                                required
                            />
                            {loadingSuggestions && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7A2F] animate-spin" />
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && locationSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DCC9A6] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                {locationSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectLocation(suggestion)}
                                        className="w-full px-4 py-3 text-left hover:bg-[#FEFAEA] border-b border-[#DCC9A6]/30 last:border-0 transition-colors"
                                    >
                                        <p className="text-[#3E2A1F] font-medium text-sm">{suggestion.formatted}</p>
                                        <p className="text-[#9C7A2F] text-xs mt-1">
                                            {suggestion.latitude.toFixed(4)}° N, {suggestion.longitude.toFixed(4)}° E • {suggestion.timezone}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coordinates Display (Read-only) */}
                {formData.birthLatitude && formData.birthLongitude && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F5EFE0] rounded-lg border border-[#DCC9A6]">
                        <div>
                            <p className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider mb-1">Latitude</p>
                            <p className="text-[#3E2A1F] font-serif">{formData.birthLatitude.toFixed(4)}°</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider mb-1">Longitude</p>
                            <p className="text-[#3E2A1F] font-serif">{formData.birthLongitude.toFixed(4)}°</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider mb-1">Timezone</p>
                            <p className="text-[#3E2A1F] font-serif">{formData.birthTimezone || 'Auto-detected'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-[#DCC9A6]">
                <div className="w-full md:w-auto">
                    <GoldenButton
                        topText={loading ? "Preserving" : (mode === 'edit' ? "Update" : "Save")}
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
