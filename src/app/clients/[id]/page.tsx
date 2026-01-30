"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientsNavigationSidebar from '@/components/clients/ClientsNavigationSidebar';

import { Sparkles, Calendar, Clock, MapPin, User, Mail, Phone, Heart, Plus, Search, X, ChevronRight, StickyNote, Save, Edit2, Loader2, Trash2 } from 'lucide-react';
import { Client, FamilyLink, RelationshipType, ClientListResponse, FamilyLinkPayload, LocationSuggestion, CreateClientPayload } from '@/types/client';
import { clientApi, familyApi } from '@/lib/api';
import { useClientMutations } from "@/hooks/mutations/useClientMutations";
import { useFamilyLinks, useFamilyMutations } from "@/hooks/queries/useFamily";
import { useClients, useClient } from "@/hooks/queries/useClients";
import Link from 'next/link';
import { useLocationSuggestions } from "@/hooks/queries/useLocations";
import ParchmentDatePicker from "@/components/ui/ParchmentDatePicker";
import ParchmentTimePicker from "@/components/ui/ParchmentTimePicker";

// Helper to strip ISO dates/times for clean input display WITH timezone awareness
const formatDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    // If it's a full ISO string or has TZ info, parse it properly
    if (dateStr.includes('T') || dateStr.includes('Z') || dateStr.includes('+')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }
    // Fallback/Naive: Extract YYYY-MM-DD literal
    return dateStr.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || dateStr;
};

const formatTime = (timeStr?: string) => {
    if (!timeStr) return undefined;

    // If it's a ISO datetime or has Z/+ suffixes, we must convert to Local
    // Note: If no date part exists, we prepend a dummy date to ensure correct parsing
    const hasDate = timeStr.includes('-') && timeStr.includes(':');
    const parseable = hasDate ? timeStr : `1970-01-01T${timeStr}${timeStr.includes('Z') || timeStr.includes('+') ? '' : ''}`;

    if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('+')) {
        const d = new Date(parseable);
        if (!isNaN(d.getTime())) {
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            const s = String(d.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
    }

    // Fallback/Naive: Extract HH:mm:ss literal, stripping any timezone/ms suffixes
    return timeStr.split('.')[0].split('+')[0].split('Z')[0];
};

// Helper to derive firstName/lastName and always normalize dates/times
const deriveNames = (c: Client): Client => {
    let firstName = c.firstName;
    let lastName = c.lastName;

    if (!firstName && !lastName && c.fullName) {
        const parts = c.fullName.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
    }

    const normalizedDate = formatDate(c.birthDate || c.dateOfBirth);
    const normalizedTime = formatTime(c.birthTime || c.timeOfBirth);

    return {
        ...c,
        firstName: firstName || '',
        lastName: lastName || '',
        birthPlace: c.birthPlace || c.placeOfBirth,
        birthDate: normalizedDate,
        birthTime: normalizedTime,
        placeOfBirth: c.birthPlace || c.placeOfBirth,
        dateOfBirth: normalizedDate,
        timeOfBirth: normalizedTime,
        phone: c.phonePrimary || c.phone,
    };
};

const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'in_law', label: 'In-Law' },
    { value: 'uncle_aunt', label: 'Uncle/Aunt' },
    { value: 'nephew_niece', label: 'Nephew/Niece' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'other', label: 'Other' },
];

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    // Core state
    const { data: rawClient, isLoading: loading, error: queryError } = useClient(clientId);
    const client = rawClient ? deriveNames(rawClient) : undefined;

    const [editData, setEditData] = useState<Partial<Client>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notes, setNotes] = useState("");
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const { updateClient } = useClientMutations();
    const [localError, setLocalError] = useState<string | null>(null);
    const error = localError || (queryError ? (queryError as Error).message : updateClient.error?.message) || null;

    // Set local error helper
    const setError = (msg: string | null) => setLocalError(msg);



    // Sync editing state when client loads
    useEffect(() => {
        if (client && !isEditing) {
            const derived = deriveNames(client);
            setEditData(derived);
            // Set initial notes from metadata or first note
            if (client.metadata?.quickNotes) {
                setNotes(client.metadata.quickNotes);
            } else if (client.notes && client.notes.length > 0) {
                setNotes(client.notes[0].noteContent);
            }
        }
    }, [client, isEditing]);

    // Location suggestions state (hooks)
    const [searchLocationQuery, setSearchLocationQuery] = useState("");
    // Debounce or just pass query - react query handles somewhat but better to have debounce for typing
    // Since we don't have a debounce hook handy, query is updated on change.
    // However, existing logic had explicit condition for length < 3
    const { data: locationData, isLoading: loadingLocations } = useLocationSuggestions(searchLocationQuery);
    const locationSuggestions = locationData?.suggestions || [];
    const isSearchingLocation = loadingLocations;

    const [isSearchingLocationState, setIsSearchingLocation] = useState(false); // Legacy var compat if needed, but derived is better.
    // For compatibility with existing render:
    // We can alias `isSearchingLocation` to `loadingLocations` but existing code uses `setIsSearchingLocation` in handlers?
    // Actually existing handler sets it manually. We should adopt the hook's state.

    // Family links state
    const [isAddingRel, setIsAddingRel] = useState(false);
    const [selectedRelType, setSelectedRelType] = useState<RelationshipType>('spouse');
    const [addingFamily, setAddingFamily] = useState(false);

    // Family Hooks
    const { data: familyLinks = [], isLoading: loadingFamily } = useFamilyLinks(clientId);
    const { linkFamily, unlinkFamily } = useFamilyMutations();

    // Search for linking (Hooks-based)
    const [searchRel, setSearchRel] = useState("");
    const { data: searchResults } = useClients({
        search: searchRel,
        limit: 10,
    });
    // Filter locally or rely on API. The API returns matching.
    // We just filter out self and already linked.
    const availableClients = (searchResults?.clients || [])
        .filter(c => c.id !== clientId && !familyLinks.some(l => l.relatedClientId === c.id))
        .map(deriveNames);

    /* Removed manual fetchFamilyLinks and searchClients functions */

    // Add family link
    const handleAddFamilyLink = async (relatedClient: Client) => {
        setAddingFamily(true);
        try {
            const payload: FamilyLinkPayload = {
                relatedClientId: relatedClient.id,
                relationshipType: selectedRelType,
            };
            await linkFamily.mutateAsync({ clientId, payload });
            setIsAddingRel(false);
            setSearchRel("");
            // setAvailableClients([]); // No need, derived from searchRel=""
        } catch (err: any) {
            console.error('Failed to add family link:', err);
            setError(err.message || 'Failed to add family member');
        } finally {
            setAddingFamily(false);
        }
    };

    // Remove family link
    const handleRemoveFamilyLink = async (relatedClientId: string) => {
        try {
            await unlinkFamily.mutateAsync({ clientId, relatedClientId });
        } catch (err: any) {
            console.error('Failed to remove family link:', err);
        }
    };

    // Save client changes
    const handleSave = async () => {
        if (!client) return;
        setIsSaving(true);
        setError(null);
        try {
            // Re-derive fullName if first/last name changed
            const updatedFullName = `${editData.firstName || ''} ${editData.lastName || ''}`.trim();

            // Scrub derived fields that don't belong in the backend update schema
            const {
                firstName, lastName, phone, dateOfBirth, timeOfBirth, placeOfBirth, avatar,
                familyLinksFrom, familyLinksTo, consultations, notes: clientNotes, remedies,
                ...cleanData
            } = editData as any;

            // Send birth details directly (they are already normalized in state by deriveNames/deriveNames)
            const payload = {
                ...cleanData,
                fullName: updatedFullName,
                birthDate: editData.birthDate || undefined,
                birthTime: editData.birthTime || undefined,
            };

            // Cast coords to numbers if they exist
            if (payload.birthLatitude !== undefined && payload.birthLatitude !== null) {
                payload.birthLatitude = Number(payload.birthLatitude);
            }
            if (payload.birthLongitude !== undefined && payload.birthLongitude !== null) {
                payload.birthLongitude = Number(payload.birthLongitude);
            }

            // const updated = await clientApi.updateClient(clientId, payload);
            await updateClient.mutateAsync({ id: clientId, data: payload }, {
                onSuccess: (updated) => {
                    // const derived = deriveNames(updated);
                    // setClient(derived); // Handled by invalidate
                    // setEditData(derived); // Reset edit data?
                    setEditData(deriveNames(updated));
                    setIsEditing(false);
                }
            });

        } catch (err: any) {
            console.error('Failed to update client:', err);
            setError(err.message || 'Failed to update client profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Save notes
    const handleSaveNotes = async () => {
        if (!clientId) return;
        setIsSavingNotes(true);
        try {
            // Safe-save notes in metadata.quickNotes
            await updateClient.mutateAsync({
                id: clientId,
                data: { metadata: { ...client?.metadata, quickNotes: notes } }
            });
            // Re-fetch handled by mutation invalidation
            // await fetchClient(); 
        } catch (err: any) {
            console.error('Failed to save notes:', err);
            setError(err.message || 'Failed to save notes');
        } finally {
            setIsSavingNotes(false);
        }
    };

    // Handle location search
    const handleLocationSearch = (query: string) => {
        setEditData(prev => ({ ...prev, birthPlace: query }));
        // Just update search query for hook
        setSearchLocationQuery(query);
    };

    // Handle location selection

    // Handle location selection
    const handleLocationSelect = (suggestion: LocationSuggestion) => {
        setEditData(prev => ({
            ...prev,
            birthPlace: suggestion.formatted,
            birthLatitude: suggestion.latitude,
            birthLongitude: suggestion.longitude,
            birthTimezone: suggestion.timezone,
            city: suggestion.city || prev.city,
            state: suggestion.state || prev.state,
            country: suggestion.country || prev.country
        }));
        setSearchLocationQuery("");
    };

    /* Legacy effects removed */

    // Loading state
    if (loading) {
        return (
            <div className="fixed inset-0 pt-[64px] flex items-center justify-center bg-parchment">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold-primary mx-auto mb-4 animate-spin" />
                    <p className="font-serif text-xl text-muted">Loading soul record...</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="fixed inset-0 pt-[64px] flex items-center justify-center bg-parchment">
                <div className="text-center">
                    <p className="font-serif text-xl text-red-600 mb-4">{error || 'Client not found'}</p>
                    <button onClick={() => router.push('/clients')} className="text-gold-dark hover:underline">
                        Return to Registry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pt-[64px] flex animate-in fade-in duration-500 bg-parchment">
            {/* Sidebar */}
            <ClientsNavigationSidebar activeClientName={client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim()} />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="relative p-2 lg:p-4 custom-scrollbar">
                    {/* Background FX - Subtle Watermark */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />

                    {/* Breadcrumb Navigation */}
                    <div className="relative z-10 mb-4 flex items-center gap-2 text-xs font-serif uppercase tracking-widest font-bold">
                        <Link href="/clients" className="text-[#6B4423] hover:text-[#2B1510] transition-colors">
                            Clients
                        </Link>
                        <ChevronRight className="w-3 h-3 text-[#6B4423]" />
                        <span className="text-[#2B1510]">Client Profile</span>
                    </div>

                    {/* Page Header - Full Width Bar */}
                    <div className="relative z-10">
                        <div className="mb-6 flex items-center justify-between bg-softwhite border border-antique rounded-2xl p-5">
                            <div className="flex items-center gap-5">
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                                    <span className="text-2xl font-serif font-bold text-gold-dark">
                                        {(client.firstName || client.fullName || 'C')[0]}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-serif text-ink font-bold">
                                        {client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client'}
                                    </h1>
                                    <p className="text-muted text-xs mt-0.5 flex items-center gap-2">
                                        <span className="text-gold-dark">#{client.id.slice(0, 8)}...</span>
                                        <span>•</span>
                                        <span>{client.rashi || 'Leo'} Rashi</span>
                                        {client.birthPlace && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.birthPlace}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-parchment border border-antique text-muted rounded-lg font-medium text-sm hover:bg-softwhite transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditData(client);
                                                setIsEditing(true);
                                            }}
                                            className="px-4 py-2 bg-softwhite border border-antique text-ink rounded-lg font-medium text-sm hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <Link href="/clients" className="px-4 py-2 border border-antique rounded-lg text-muted hover:text-ink hover:border-gold-primary transition-colors text-sm">
                                            Back
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50/50 border border-red-200/50 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
                                <div className="flex items-center gap-3">
                                    <X className="w-5 h-5 text-red-500" />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        )}

                        {/* === TOP ROW: Personal Details, Birth Location, Astrological Signature === */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 animate-in slide-in-from-bottom-4 duration-500">

                            {/* Personal Details Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                                <h3 className="text-base font-serif text-ink mb-4 flex items-center gap-2 font-semibold">
                                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                                        <User className="w-3.5 h-3.5 text-gold-dark" />
                                    </div>
                                    Personal Details
                                </h3>
                                <div className="space-y-3">
                                    <DetailItem
                                        label="Full Name"
                                        value={isEditing ? (editData.fullName || `${editData.firstName || ''} ${editData.lastName || ''}`.trim()) : (client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim())}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, fullName: val, firstName: val.split(' ')[0] || '', lastName: val.split(' ').slice(1).join(' ') || '' }))}
                                    />
                                    <DetailItem
                                        label="Gender"
                                        value={(isEditing ? editData.gender : client.gender) || "female"}
                                        isEditing={isEditing}
                                        type="select"
                                        options={[{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }]}
                                        onChange={(val) => setEditData(prev => ({ ...prev, gender: val as any }))}
                                    />
                                    <DetailItem
                                        label="Date of Birth"
                                        value={(isEditing ? editData.birthDate : client.birthDate) || ''}
                                        isEditing={isEditing}
                                        type="date"
                                        onChange={(val) => setEditData(prev => ({ ...prev, birthDate: val }))}
                                    />
                                    <DetailItem
                                        label="Time of Birth"
                                        value={(isEditing ? editData.birthTime : client.birthTime) || ""}
                                        isEditing={isEditing}
                                        type="time"
                                        onChange={(val) => setEditData(prev => ({ ...prev, birthTime: val }))}
                                    />
                                </div>
                            </div>

                            {/* Birth Location Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                                <h3 className="text-base font-serif text-ink mb-4 flex items-center gap-2 font-semibold">
                                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                                        <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                                    </div>
                                    Birth Location
                                </h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Place of Birth</p>
                                        {isEditing ? (
                                            <>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={editData.birthPlace || ''}
                                                        onChange={(e) => handleLocationSearch(e.target.value)}
                                                        className="w-full text-sm font-serif text-ink font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                                                        placeholder="Search birth city..."
                                                    />
                                                    {isSearchingLocation && (
                                                        <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gold-primary animate-spin" />
                                                    )}
                                                </div>

                                                {/* Suggestions Dropdown */}
                                                {locationSuggestions.length > 0 && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-antique shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                                        {locationSuggestions.map((s, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleLocationSelect(s)}
                                                                className="w-full text-left px-3 py-2 hover:bg-parchment transition-colors border-b border-antique last:border-0 flex items-center gap-2"
                                                            >
                                                                <MapPin className="w-3 h-3 text-gold-dark" />
                                                                <div>
                                                                    <p className="text-xs font-medium text-ink">{s.formatted}</p>
                                                                    <p className="text-[9px] text-muted font-bold uppercase tracking-wider">
                                                                        {s.latitude.toFixed(4)}°, {s.longitude.toFixed(4)}°
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm font-serif text-ink font-medium border-b border-antique pb-2">
                                                {client.birthPlace || 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                    <DetailItem
                                        label="Latitude"
                                        value={editData.birthLatitude?.toString() || client.birthLatitude?.toString() || ""}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, birthLatitude: parseFloat(val) || 0 }))}
                                    />
                                    <DetailItem
                                        label="Longitude"
                                        value={editData.birthLongitude?.toString() || client.birthLongitude?.toString() || ""}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, birthLongitude: parseFloat(val) || 0 }))}
                                    />
                                    <DetailItem
                                        label="Timezone"
                                        value={editData.birthTimezone || client.birthTimezone || ""}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, birthTimezone: val }))}
                                    />
                                </div>
                            </div>

                            {/* Astrological Signature Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                                <h3 className="text-base font-serif text-ink mb-4 flex items-center gap-2 font-semibold">
                                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                                        <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                                    </div>
                                    Astrological Signature
                                </h3>
                                <div className="space-y-3">
                                    <DetailItem label="Rashi (Moon Sign)" value={client.rashi || "Leo"} isEditing={isEditing} />
                                    <DetailItem label="Nakshatra" value={client.nakshatra || "Magha"} isEditing={isEditing} />
                                    <DetailItem label="Pada" value={"3"} isEditing={isEditing} />
                                    <DetailItem label="Lagna (Ascendant)" value={"Scorpio"} isEditing={isEditing} />
                                    <DetailItem label="Lagna Lord" value={"Mars"} isEditing={isEditing} />
                                    <DetailItem label="Nakshatra Lord" value={"Ketu"} isEditing={isEditing} />
                                </div>
                            </div>
                        </div>

                        {/* === SECOND ROW: Contact Info & Tags === */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Contact Card */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-5">
                                <h3 className="text-base font-serif text-ink mb-4 flex items-center gap-2 font-semibold">
                                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                                        <Phone className="w-3.5 h-3.5 text-gold-dark" />
                                    </div>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem
                                        label="Email Address"
                                        value={(isEditing ? editData.email : client.email) || ""}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, email: val }))}
                                    />
                                    <DetailItem
                                        label="Phone Number"
                                        value={(isEditing ? editData.phonePrimary : client.phonePrimary) || ""}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditData(prev => ({ ...prev, phonePrimary: val }))}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-5">
                                <h3 className="text-base font-serif text-ink mb-4 font-semibold">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {client.tags?.map(t => (
                                        <span key={t} className="px-3 py-1.5 rounded-full bg-parchment border border-antique text-gold-dark text-xs font-bold">{t}</span>
                                    ))}
                                    {isEditing && (
                                        <button className="px-3 py-1.5 rounded-full border border-dashed border-gold-primary/50 text-gold-primary text-xs font-bold hover:bg-gold-primary/10 transition-colors">
                                            + Add Tag
                                        </button>
                                    )}
                                    {(!client.tags || client.tags.length === 0) && !isEditing && (
                                        <span className="text-muted text-sm italic">No tags yet</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* === FAMILY LINKS SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Family Connections</h2>
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
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
                                            <h4 className="text-ink font-serif font-bold">Add Family Connection</h4>
                                            <button onClick={() => { setIsAddingRel(false); setSearchRel(''); }} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
                                        </div>

                                        {/* Relationship Type Selector */}
                                        <div className="mb-4">
                                            <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Relationship Type</label>
                                            <select
                                                value={selectedRelType}
                                                onChange={(e) => setSelectedRelType(e.target.value as RelationshipType)}
                                                className="w-full bg-parchment border border-antique rounded-lg py-2.5 px-4 text-ink text-sm focus:outline-none focus:border-gold-primary"
                                            >
                                                {RELATIONSHIP_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Client Search */}
                                        <div className="relative mb-4">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
                                            <input
                                                type="text"
                                                placeholder="Search clients..."
                                                value={searchRel}
                                                onChange={(e) => setSearchRel(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-white/50 border border-antique rounded-lg focus:border-gold-primary outline-none"
                                            />
                                        </div>

                                        {/* Available Clients List */}
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {availableClients.length > 0 ? availableClients.map((c: Client) => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => handleAddFamilyLink(c)}
                                                    disabled={addingFamily}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-parchment rounded-lg transition-colors text-left disabled:opacity-50"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-dark font-serif font-bold text-sm">
                                                        {(c.firstName || c.fullName || '?')[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-ink font-medium text-sm">{c.firstName || ''} {c.lastName || ''}</p>
                                                        <p className="text-muted text-xs">{c.placeOfBirth || c.birthPlace || 'No location'}</p>
                                                    </div>
                                                    <span className="text-gold-dark text-xs font-medium">
                                                        {addingFamily ? 'Adding...' : `Add as ${RELATIONSHIP_OPTIONS.find(o => o.value === selectedRelType)?.label}`}
                                                    </span>
                                                </button>
                                            )) : searchRel.length >= 2 ? (
                                                <p className="text-muted text-sm text-center py-4">No clients found</p>
                                            ) : (
                                                <p className="text-muted text-sm text-center py-4">Type at least 2 characters to search</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Family Links List */}
                                <div className="space-y-3">
                                    {loadingFamily ? (
                                        <div className="text-center py-16">
                                            <Loader2 className="w-8 h-8 text-gold-primary mx-auto mb-3 animate-spin" />
                                            <p className="text-muted font-serif">Loading family connections...</p>
                                        </div>
                                    ) : familyLinks.length > 0 ? (
                                        familyLinks.map((link: FamilyLink) => (
                                            <div key={link.id} className="flex items-center p-5 bg-softwhite border border-antique rounded-xl hover:border-gold-primary/50 transition-all">
                                                <div className="w-12 h-12 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif text-lg text-gold-dark mr-4">
                                                    {(link.relatedClient?.firstName || link.relatedClient?.fullName || '?')[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-serif font-bold text-ink">
                                                        {link.relatedClient?.firstName || ''} {link.relatedClient?.lastName || link.relatedClient?.fullName || ''}
                                                    </h3>
                                                    <p className="text-muted text-sm">
                                                        {RELATIONSHIP_OPTIONS.find(o => o.value === link.relationshipType)?.label || link.relationshipType}
                                                        {link.relatedClient?.birthPlace && ` • ${link.relatedClient.birthPlace}`}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/clients/${link.relatedClientId}`} className="px-4 py-2 rounded-lg border border-antique text-gold-dark text-xs font-semibold hover:bg-gold-primary hover:text-white transition-all">
                                                        View Chart
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveFamilyLink(link.relatedClientId)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all"
                                                        title="Remove relationship"
                                                    >                                                   <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 border border-dashed border-antique rounded-xl bg-parchment/30">
                                            <Heart className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                                            <p className="text-muted font-serif">No family connections mapped yet.</p>
                                            <p className="text-muted/70 text-sm mt-1">Click "Add Connection" to link family members for Kundali matching.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* === SESSION NOTES SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Session Notes</h2>
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-softwhite rounded-xl border border-antique p-6 min-h-[500px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-serif font-bold text-ink">Quick Notes</h3>
                                        <button
                                            onClick={handleSaveNotes}
                                            disabled={isSavingNotes}
                                            className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSavingNotes ? "Saving..." : "Save"}
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
                        </div>

                        {/* === PAST SESSIONS SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Past Sessions</h2>
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
                        </div>

                        {/* === PREDICTIONS MADE SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Predictions Made</h2>
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
                        </div>

                        {/* === REMEDIES GIVEN SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Remedies Given</h2>
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
                        </div>

                        {/* === DOCUMENTS SECTION === */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Documents</h2>
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
                        </div>

                        {/* === PAYMENT HISTORY SECTION === */}
                        <div className="mt-16 mb-16">
                            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Payment History</h2>
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
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({
    label,
    value,
    isEditing = false,
    onChange,
    type = 'text',
    options = []
}: {
    label: string,
    value: string,
    isEditing?: boolean,
    onChange?: (val: string) => void,
    type?: 'text' | 'select' | 'date' | 'time',
    options?: { v: string, l: string }[]
}) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B4423] font-bold mb-1">{label}</p>
            {isEditing ? (
                type === 'select' ? (
                    <select
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full text-base font-serif text-[#2B1510] font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                        defaultValue={value}
                    >
                        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                ) : type === 'date' ? (
                    <ParchmentDatePicker
                        date={value}
                        setDate={(val) => onChange?.(val || '')}
                    />
                ) : type === 'time' ? (
                    <ParchmentTimePicker
                        value={value}
                        onChange={(val) => onChange?.(val || '')}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full text-base font-serif text-[#2B1510] font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                    />
                )
            ) : (
                <p className="text-base font-serif text-[#2B1510] font-semibold border-b border-antique pb-2">
                    {type === 'select' ? (options.find(o => o.v === value)?.l || value) : value || 'N/A'}
                </p>
            )}
        </div>
    );
}
