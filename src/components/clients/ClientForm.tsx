"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Calendar, Globe, Phone, Mail, Briefcase, Search, Loader2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import GoldenButton from "@/components/GoldenButton";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import ParchmentDatePicker from "@/components/ui/ParchmentDatePicker";
import ParchmentTimePicker from "@/components/ui/ParchmentTimePicker";
import { clientApi, geocodeApi } from "@/lib/api";
import { LocationSuggestion, CreateClientPayload, Client } from "@/types/client";
import { useClientMutations } from "@/hooks/mutations/useClientMutations";

interface ClientFormProps {
    mode?: 'create' | 'edit';
    initialData?: Client;
    onSuccess?: (client: Client) => void;
}

export default function ClientForm({ mode = 'create', initialData, onSuccess }: ClientFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { createClient, updateClient } = useClientMutations();

    // Location Autocomplete State
    const [locationQuery, setLocationQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [manualCoordinates, setManualCoordinates] = useState(false);

    // Helper to strip ISO dates/times for clean input display WITH timezone awareness
    const formatDateHelper = (dateStr?: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('T') || dateStr.includes('Z') || dateStr.includes('+')) {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            }
        }
        return dateStr.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || dateStr;
    };

    const formatTimeHelper = (timeStr?: string) => {
        if (!timeStr) return '';
        const hasDate = timeStr.includes('-') && timeStr.includes(':');
        const parseable = hasDate ? timeStr : `1970-01-01T${timeStr}`;
        if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('+')) {
            const d = new Date(parseable);
            if (!isNaN(d.getTime())) {
                const h = String(d.getHours()).padStart(2, '0');
                const m = String(d.getMinutes()).padStart(2, '0');
                const s = String(d.getSeconds()).padStart(2, '0');
                return `${h}:${m}:${s}`;
            }
        }
        return timeStr.split('.')[0].split('+')[0].split('Z')[0];
    };

    // Form State - All fields for comprehensive client registration
    const [formData, setFormData] = useState({
        // Personal Identity
        fullName: initialData?.firstName && initialData?.lastName
            ? `${initialData.firstName} ${initialData.lastName}`
            : (initialData?.fullName || ''),
        gender: initialData?.gender || 'female',

        // Contact Information
        email: initialData?.email || '',
        phonePrimary: initialData?.phonePrimary || initialData?.phone || '',
        phoneSecondary: initialData?.phoneSecondary || '',

        // Birth Details - Critical for Vedic chart calculations
        dateOfBirth: formatDateHelper(initialData?.birthDate) || '',
        timeOfBirth: formatTimeHelper(initialData?.birthTime) || '',
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

        // Additional Information
        notes: (initialData?.notes && Array.isArray(initialData.notes) && initialData.notes.length > 0)
            ? initialData.notes[0].noteContent // Get the latest/first note content
            : '',
    });

    // Track if birth data was actually modified by user
    const [birthDataModified, setBirthDataModified] = useState(false);

    // Simplified Rehydration - Strings are clean and TZ neutral
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: formatDateHelper(initialData.birthDate) || '',
                timeOfBirth: formatTimeHelper(initialData.birthTime) || '',
                birthPlace: initialData.birthPlace || initialData.placeOfBirth || '',
            }));
            if (initialData.birthPlace || initialData.placeOfBirth) {
                setLocationQuery(initialData.birthPlace || initialData.placeOfBirth || '');
            }
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
            // Prepare payload matching backend schema
            const payload: CreateClientPayload = {
                fullName: formData.fullName.trim(),
                email: formData.email || undefined,
                phonePrimary: formData.phonePrimary || undefined,
                phoneSecondary: formData.phoneSecondary || undefined,

                // Birth details - simple strings avoid all TZ conversion issues
                birthDate: formData.dateOfBirth || undefined,
                birthTime: formData.timeOfBirth || undefined,
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

                // Metadata - Cast to any to bypass strict type checking until types are fully synced
                // The backend accepts 'notes' as a string in the update payload
                notes: formData.notes || undefined,
            } as any;

            if (mode === 'edit' && initialData?.id) {
                const updateVariables = { id: initialData.id, data: payload };
                await updateClient.mutateAsync(updateVariables, {
                    onSuccess: (updated) => {
                        console.log("Client updated (via mutation):", updated);
                        if (onSuccess) {
                            onSuccess(updated as any);
                        } else {
                            router.push('/clients');
                        }
                    },
                    onError: (err: any) => {
                        console.error("Failed to update client:", err);
                        setError(err.message || 'Failed to update client. Please try again.');
                    }
                });
            } else {
                await createClient.mutateAsync(payload, {
                    onSuccess: (newClient) => {
                        console.log("Client created (via mutation):", newClient);
                        if (onSuccess) {
                            onSuccess(newClient as any);
                        } else {
                            router.push('/clients');
                        }
                    },
                    onError: (err: any) => {
                        console.error("Failed to create client:", err);
                        setError(err.message || 'Failed to create client. Please try again.');
                    }
                });
            }
        } catch (err: any) {
            // This catch block might be redundant with onError callbacks but serves as a safety net
            console.error("Unexpected error in submission:", err);
            // setError handles safely inside mutation callbacks usually, but if something fails outside mutation:
            setError(err.message || "An unexpected error occurred.");
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
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#DCC9A6]">
                    <User className="w-5 h-5 text-[#8B6914]" />
                    <h2 className="font-serif text-lg font-bold text-[#2A1810]">Personal Identity</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <div>
                        <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                            Full Name <span className="text-red-600">*</span>
                        </label>
                        <ParchmentInput
                            placeholder="Full Name"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                            Gender <span className="text-red-600">*</span>
                        </label>
                        <ParchmentSelect
                            label=""
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            options={[
                                { value: 'female', label: 'Female' },
                                { value: 'male', label: 'Male' },
                                { value: 'other', label: 'Other' }
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                            Marital Status
                        </label>
                        <ParchmentSelect
                            label=""
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
            </div>

            {/* 2. Contact Information Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#DCC9A6]">
                    <Phone className="w-5 h-5 text-[#8B6914]" />
                    <h2 className="font-serif text-lg font-bold text-[#2A1810]">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#DCC9A6]">
                    <Calendar className="w-5 h-5 text-[#8B6914]" />
                    <h2 className="font-serif text-lg font-bold text-[#2A1810]">Cosmic Snapshot (Birth Data)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <div>
                        <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                            Date of Birth <span className="text-red-600">*</span>
                        </label>
                        <ParchmentDatePicker
                            label=""
                            placeholder="Select Birth Date"
                            date={formData.dateOfBirth}
                            setDate={(dateString) => handleChange('dateOfBirth', dateString)}
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                            Time of Birth <span className="text-red-600">*</span>
                        </label>
                        <ParchmentTimePicker
                            label=""
                            placeholder="Select Birth Time"
                            value={formData.timeOfBirth}
                            onChange={(timeString) => handleChange('timeOfBirth', timeString)}
                        />
                    </div>
                </div>

                {/* Birth Place with Autocomplete */}
                <div className="mb-4">
                    <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                        Place of Birth <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6914]" />
                            <input
                                type="text"
                                placeholder="Search city or town..."
                                value={locationQuery}
                                onChange={(e) => {
                                    setLocationQuery(e.target.value);
                                    handleChange('birthPlace', e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setShowSuggestions(false);
                                        // Use setFormData callback to ensure we read the latest state,
                                        // avoiding the closure trap if selectLocation was clicked
                                        setFormData(prev => {
                                            if (locationQuery.trim().length > 0 && prev.birthLatitude === undefined && !manualCoordinates) {
                                                setManualCoordinates(true);
                                                return {
                                                    ...prev,
                                                    birthLatitude: 0,
                                                    birthLongitude: 0,
                                                    birthTimezone: 'Asia/Kolkata'
                                                };
                                            }
                                            return prev;
                                        });
                                    }, 200);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Tab') {
                                        setFormData(prev => {
                                            if (locationQuery.trim().length > 0 && prev.birthLatitude === undefined && !manualCoordinates) {
                                                setManualCoordinates(true);
                                                return {
                                                    ...prev,
                                                    birthLatitude: 0,
                                                    birthLongitude: 0,
                                                    birthTimezone: 'Asia/Kolkata'
                                                };
                                            }
                                            return prev;
                                        });
                                    }
                                }}
                                className="w-full bg-transparent border-b border-[#C9A24D]/50 py-2 pl-10 pr-10 text-[#2A1810] font-serif placeholder:text-[#8B6914] placeholder:opacity-80 focus:outline-none focus:border-[#9C7A2F] transition-colors"
                                required
                            />
                            {loadingSuggestions && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6914] animate-spin" />
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

                {/* Manual Coordinates Toggle */}
                <div className="mt-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="manualCoords"
                        checked={manualCoordinates}
                        onChange={(e) => {
                            setManualCoordinates(e.target.checked);
                            // Initialize coordinates if enabling manual mode and they're empty
                            if (e.target.checked && formData.birthLatitude === undefined) {
                                handleChange('birthLatitude', 0);
                                handleChange('birthLongitude', 0);
                                handleChange('birthTimezone', 'Asia/Kolkata');
                            }
                        }}
                        className="w-4 h-4 accent-[#9C7A2F] cursor-pointer"
                    />
                    <label htmlFor="manualCoords" className="text-sm text-[#3E2A1F] font-serif cursor-pointer">
                        Enter coordinates manually (for precise calculations)
                    </label>
                </div>

                {/* Coordinates Display - Now shows for manual mode OR after location selection */}
                {(manualCoordinates || (formData.birthLatitude !== undefined && formData.birthLongitude !== undefined)) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#FEFAEA] rounded-xl border border-[#DCC9A6] shadow-sm">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider block">Latitude <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.birthLatitude}
                                onChange={(e) => handleChange('birthLatitude', parseFloat(e.target.value))}
                                className="w-full bg-transparent border-b border-[#DCC9A6] focus:border-[#9C7A2F] focus:outline-none py-1 text-[#3E2A1F] font-serif"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider block">Longitude <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.birthLongitude}
                                onChange={(e) => handleChange('birthLongitude', parseFloat(e.target.value))}
                                className="w-full bg-transparent border-b border-[#DCC9A6] focus:border-[#9C7A2F] focus:outline-none py-1 text-[#3E2A1F] font-serif"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#9C7A2F] uppercase tracking-wider block">Timezone <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.birthTimezone}
                                onChange={(e) => handleChange('birthTimezone', e.target.value)}
                                placeholder="e.g. Asia/Kolkata"
                                className="w-full bg-transparent border-b border-[#DCC9A6] focus:border-[#9C7A2F] focus:outline-none py-1 text-[#3E2A1F] font-serif"
                                required
                            />
                        </div>
                        {/* Validation hints */}
                        <div className="md:col-span-3 text-xs text-[#9C7A2F]/70 italic">
                            Latitude: -90 to 90 (e.g., 27.1833 for Agra) • Longitude: -180 to 180 (e.g., 78.0167)
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Notes & Observations */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#DCC9A6]">
                    <FileText className="w-5 h-5 text-[#8B6914]" />
                    <h2 className="font-serif text-lg font-bold text-[#2A1810]">Notes & Observations</h2>
                </div>

                <div className="space-y-2">
                    <label className="block text-[11px] font-bold font-serif text-[#3E2A1F] uppercase tracking-widest mb-1">
                        Client Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder="Add any initial observations, specific questions, or important context about the client here..."
                        className="w-full bg-transparent border border-[#C9A24D]/50 rounded-lg p-3 min-h-[100px] text-[#2A1810] font-serif placeholder:text-[#8B6914] placeholder:opacity-80 focus:outline-none focus:border-[#9C7A2F] transition-colors resize-y"
                    />
                </div>
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
