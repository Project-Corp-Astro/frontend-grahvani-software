// Client interface matching backend schema
// Essential for Vedic astrology: accurate birth details enable precise chart calculations
export interface Client {
    id: string;
    clientCode?: string;
    tenantId?: string;

    // Basic Information
    fullName: string;
    firstName?: string;  // Derived for UI display
    lastName?: string;   // Derived for UI display
    phonePrimary?: string;
    phoneSecondary?: string;
    email?: string;
    photoUrl?: string;

    // Birth Details - Critical for Chart Calculations
    birthDate?: string;        // YYYY-MM-DD
    birthTime?: string;        // HH:mm or HH:mm:ss
    birthPlace?: string;       // Full place name
    birthLatitude?: number;    // Decimal degrees (e.g., 28.6139)
    birthLongitude?: number;   // Decimal degrees (e.g., 77.2090)
    birthTimezone?: string;    // IANA timezone (e.g., 'Asia/Kolkata')
    birthTimeKnown?: boolean;
    birthTimeAccuracy?: 'exact' | 'approximate' | 'rectified' | 'unknown';

    // Personal Details
    gender?: 'male' | 'female' | 'other';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    occupation?: string;
    businessDetails?: string;
    currentSituation?: string;
    specialConsiderations?: string;

    // Address (Current Location)
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    // Organization & Tags
    tags?: string[];
    metadata?: {
        quickNotes?: string;
        [key: string]: any;
    };

    // Relations (Partial)
    notes?: { id: string; noteContent: string; createdAt: string }[];

    // Computed Astrological Data
    rashi?: string;       // Moon Sign (e.g., 'Leo')
    nakshatra?: string;   // Birth Star (e.g., 'Magha')
    lagna?: string;       // Ascendant

    // Timestamps
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;

    // Legacy fields for backwards compatibility
    placeOfBirth?: string;         // Alias for birthPlace  
    dateOfBirth?: string;          // Alias for birthDate
    timeOfBirth?: string;          // Alias for birthTime
    lastConsulted?: string;
    nextConsultation?: string;
    lastConsultationType?: string;
    avatar?: string;               // Alias for photoUrl
    phone?: string;                // Alias for phonePrimary
}

// API Request/Response Types
export interface CreateClientPayload {
    fullName: string;
    phonePrimary?: string;
    phoneSecondary?: string;
    email?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    birthLatitude?: number;
    birthLongitude?: number;
    birthTimezone?: string;
    birthTimeKnown?: boolean;
    birthTimeAccuracy?: 'exact' | 'approximate' | 'rectified' | 'unknown';
    gender?: 'male' | 'female' | 'other';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    occupation?: string;
    city?: string;
    state?: string;
    country?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface ClientListResponse {
    clients: Client[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface FamilyLink {
    id: string;
    relatedClientId: string;
    relatedClient: Client;
    relationshipType: RelationshipType;
    relationshipLabel?: string;
    notes?: string;
}

export type RelationshipType =
    | 'spouse'
    | 'child'
    | 'parent'
    | 'sibling'
    | 'grandparent'
    | 'grandchild'
    | 'in_law'
    | 'uncle_aunt'
    | 'nephew_niece'
    | 'cousin'
    | 'other';

export interface FamilyLinkPayload {
    relatedClientId: string;
    relationshipType: RelationshipType;
    relationshipLabel?: string;
    notes?: string;
}

export interface LocationSuggestion {
    formatted: string;
    latitude: number;
    longitude: number;
    timezone: string;
    city?: string;
    state?: string;
    country?: string;
}

