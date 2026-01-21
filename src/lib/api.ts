// API Utility for Grahvani Frontend
// Handles communication with microservices

import { CreateClientPayload, FamilyLinkPayload, Client, ClientListResponse, FamilyLink, LocationSuggestion } from '@/types/client';

// ============ TYPE DEFINITIONS ============

export interface DashaPeriod {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    ageAtStart?: number;
    subPeriods?: DashaPeriod[];
}

export interface DashaResponse {
    clientId: string;
    clientName: string;
    level: string;
    ayanamsa: string;
    data: {
        mahadashas?: DashaPeriod[];
        current_dasha?: DashaPeriod;
    };
    dasha_list?: any[]; // For deep tree structure
    cached: boolean;
    calculatedAt: string;
}

export interface AshtakavargaResponse {
    clientId: string;
    clientName: string;
    ayanamsa: string;
    data: {
        sarvashtakavarga?: Record<string, number[]>;
        bhinnashtakavarga?: Record<string, Record<string, number[]>>;
        total_points?: number;
    };
    cached: boolean;
    calculatedAt: string;
}

export interface SystemCapabilities {
    charts: {
        divisional: string[];
        special: string[];
        lagna: string[];
    };
    features: {
        dasha: string[];
        ashtakavarga: string[];
        compatibility: string[];
        numerology: string[];
    };
    hasDivisional: boolean;
    hasAshtakavarga: boolean;
    hasNumerology: boolean;
    hasCompatibility: boolean;
    hasHorary: boolean;
}

// Chart metadata for display
export const CHART_METADATA: Record<string, { name: string; desc: string; category: string }> = {
    'D1': { name: 'Rashi', desc: 'Physical Body & General Destiny', category: 'divisional' },
    'D2': { name: 'Hora', desc: 'Wealth & Financial Prospects', category: 'divisional' },
    'D3': { name: 'Drekkana', desc: 'Siblings & Courage', category: 'divisional' },
    'D4': { name: 'Chaturthamsha', desc: 'Fortune & Property', category: 'divisional' },
    'D7': { name: 'Saptamsha', desc: 'Children & Progeny', category: 'divisional' },
    'D9': { name: 'Navamsha', desc: 'Marriage & Spiritual Core', category: 'divisional' },
    'D10': { name: 'Dashamsha', desc: 'Career & Profession', category: 'divisional' },
    'D12': { name: 'Dwadashamsha', desc: 'Parents & Ancestry', category: 'divisional' },
    'D16': { name: 'Shodashamsha', desc: 'Vehicles & Comforts', category: 'divisional' },
    'D20': { name: 'Vimshamsha', desc: 'Spiritual Progress', category: 'divisional' },
    'D24': { name: 'Chaturvimshamsha', desc: 'Education & Learning', category: 'divisional' },
    'D27': { name: 'Saptavimshamsha', desc: 'Strength & Vitality', category: 'divisional' },
    'D30': { name: 'Trimshamsha', desc: 'Misfortunes & Evil', category: 'divisional' },
    'D40': { name: 'Khavedamsha', desc: 'Auspicious Effects', category: 'divisional' },
    'D45': { name: 'Akshavedamsha', desc: 'General Indications', category: 'divisional' },
    'D60': { name: 'Shashtiamsha', desc: 'Past Karma & Results', category: 'divisional' },
    'moon': { name: 'Moon Chart', desc: 'Emotional & Mental State', category: 'special' },
    'sun': { name: 'Sun Chart', desc: 'Soul Purpose & Father', category: 'special' },
    'sudarshan': { name: 'Sudarshan Chakra', desc: 'Triple View Analysis', category: 'special' },
    'transit': { name: 'Transit', desc: 'Current Planetary Positions', category: 'special' },
    'arudha': { name: 'Arudha Lagna', desc: 'Worldly Image & Perception', category: 'lagna' },
    'bhava': { name: 'Bhava Lagna', desc: 'House Strengths', category: 'lagna' },
    'hora': { name: 'Hora Lagna', desc: 'Wealth Indicator', category: 'lagna' },
    'sripathi': { name: 'Sripathi Bhava', desc: 'Unequal House System', category: 'lagna' },
    'kp_bhava': { name: 'KP Bhava', desc: 'KP System Houses', category: 'lagna' },
    'equal_bhava': { name: 'Equal Bhava', desc: 'Equal House System', category: 'lagna' },
    'karkamsha_d1': { name: 'Karkamsha D1', desc: 'Atmakaraka in Navamsha to D1', category: 'lagna' },
    'karkamsha_d9': { name: 'Karkamsha D9', desc: 'Atmakaraka in Navamsha', category: 'lagna' },
};

// Dasha system metadata for display
export const DASHA_TYPES: Record<string, { name: string; years: number; desc: string; category: 'primary' | 'conditional' }> = {
    vimshottari: {
        name: 'Vimshottari',
        years: 120,
        desc: 'Universal Moon-nakshatra based dasha system',
        category: 'primary'
    },
    tribhagi: {
        name: 'Tribhagi',
        years: 40,
        desc: 'One-third portions of Vimshottari periods',
        category: 'conditional'
    },
    shodashottari: {
        name: 'Shodashottari',
        years: 116,
        desc: 'For Venus in 9th + Lagna in hora of Venus',
        category: 'conditional'
    },
    dwadashottari: {
        name: 'Dwadashottari',
        years: 112,
        desc: 'Venus in Lagna + Moon in Venusian nakshatra',
        category: 'conditional'
    },
    panchottari: {
        name: 'Panchottari',
        years: 105,
        desc: 'Cancer Lagna with Dhanishtha nakshatra',
        category: 'conditional'
    },
    chaturshitisama: {
        name: 'Chaturshitisama',
        years: 84,
        desc: '10th lord posited in 10th house',
        category: 'conditional'
    },
    satabdika: {
        name: 'Satabdika',
        years: 100,
        desc: 'Lagna in Vargottama position',
        category: 'conditional'
    },
    dwisaptati: {
        name: 'Dwisaptati Sama',
        years: 72,
        desc: 'Lagna lord in 7th or 7th lord in Lagna',
        category: 'conditional'
    },
    shastihayani: {
        name: 'Shastihayani',
        years: 60,
        desc: 'Sun posited in the Lagna',
        category: 'conditional'
    },
    shattrimshatsama: {
        name: 'Shattrimshatsama',
        years: 36,
        desc: 'Born in daytime with Moon in Lagna',
        category: 'conditional'
    },
    chara: {
        name: 'Chara (Jaimini)',
        years: 0,
        desc: 'Sign-based Jaimini dasha system',
        category: 'conditional'
    },
};

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001/api/v1';
const USER_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002/api/v1';
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:3008/api/v1';

async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...((options.headers as any) || {}),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle Session Expiration (401)
        if (response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login?expired=true';
            }
        }

        const errorMessage = errorData.error?.message || errorData.message || `API Error: ${response.status}`;
        const errorDetails = errorData.error?.details ? ` - ${JSON.stringify(errorData.error.details)}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// ============ AUTH API ============
export const authApi = {
    login: (credentials: any) => apiFetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (data: any) => apiFetch(`${AUTH_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => apiFetch(`${AUTH_URL}/auth/logout`, {
        method: 'POST',
    }),
};

// ============ USER API ============
export const userApi = {
    getMe: () => apiFetch(`${USER_URL}/users/me`),
    updatePreferences: (prefs: any) => apiFetch(`${USER_URL}/users/me/preferences`, {
        method: 'PUT',
        body: JSON.stringify(prefs),
    }),
};

// ============ CLIENT API ============
// Core client management for astrology practice
export const clientApi = {
    /**
     * Get all clients with pagination and search
     */
    getClients: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        gender?: string;
        city?: string;
        myClientsOnly?: boolean;
    }): Promise<ClientListResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.search) searchParams.set('search', params.search);
        if (params?.gender) searchParams.set('gender', params.gender);
        if (params?.city) searchParams.set('city', params.city);
        if (params?.myClientsOnly) searchParams.set('myClientsOnly', 'true');

        const query = searchParams.toString();
        return apiFetch(`${CLIENT_URL}/clients${query ? `?${query}` : ''}`);
    },

    /**
     * Get single client by ID
     */
    getClient: (id: string): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`),

    /**
     * Create new client (registration)
     */
    createClient: (data: CreateClientPayload): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Update client profile
     */
    updateClient: (id: string, data: Partial<CreateClientPayload>): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    /**
     * Delete client (soft delete)
     */
    deleteClient: (id: string): Promise<void> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`, {
            method: 'DELETE',
        }),

    /**
     * Get location suggestions
     */
    getSuggestions: (query: string, limit: number = 5): Promise<{ suggestions: LocationSuggestion[] }> =>
        apiFetch(`${CLIENT_URL}/geocode/suggest?q=${encodeURIComponent(query)}&limit=${limit}`),

    /**
     * Get saved charts for a client
     */
    getCharts: (clientId: string): Promise<any[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts`),

    /**
     * Trigger chart generation for a client
     */
    generateChart: (clientId: string, chartType: string = 'D1', ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType, ayanamsa }),
        }),

    /**
     * Trigger bulk core chart generation (D1, D9 for all systems)
     */
    generateCoreCharts: (clientId: string): Promise<{ success: boolean; count: number }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate-core`, {
            method: 'POST',
        }),

    /**
     * Trigger exhaustive chart generation (All vargas, dashas, diagrams)
     */
    generateFullVedicProfile: (clientId: string): Promise<{ success: boolean; count: number }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate-full`, {
            method: 'POST',
        }),

    /**
     * Generate Vimshottari Dasha periods for a client
     * @param level - 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'sookshma' | 'prana'
     * @param ayanamsa - 'lahiri' | 'raman' | 'kp'
     * @param save - if true, saves dasha to database
     */
    generateDasha: (
        clientId: string,
        level: string = 'mahadasha',
        ayanamsa: string = 'lahiri',
        save: boolean = false,
        context: { mahaLord?: string; antarLord?: string; pratyantarLord?: string } = {}
    ): Promise<DashaResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/dasha`, {
            method: 'POST',
            body: JSON.stringify({ level, ayanamsa, save, ...context }),
        }),

    /**
     * Generate Other Dasha Systems (Tribhagi, Shodashottari, etc.)
     * @param type - tribhagi | shodashottari | dwadashottari | panchottari | chaturshitisama | satabdika | dwisaptati | shastihayani | shattrimshatsama | chara
     * @param ayanamsa - 'lahiri' | 'raman' | 'kp'
     */
    generateOtherDasha: (
        clientId: string,
        type: string,
        ayanamsa: string = 'lahiri'
    ): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/dasha/other`, {
            method: 'POST',
            body: JSON.stringify({ type, ayanamsa }),
        }),

    /**
     * Generate Ashtakavarga (Lahiri/Raman only)
     * @param type - 'bhinna' (default) | 'sarva' | 'shodasha'
     */
    generateAshtakavarga: (clientId: string, ayanamsa: string = 'lahiri', type: string = 'bhinna'): Promise<AshtakavargaResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/ashtakavarga`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa, type }),
        }),

    /**
     * Generate Sudarshan Chakra
     */
    generateSudarshanChakra: (clientId: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/sudarshan-chakra`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa }),
        }),

    /**
     * Get Yoga Analysis for a specific client
     */
    getYogaAnalysis: (clientId: string, yogaType: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/yoga/${yogaType}?ayanamsa=${ayanamsa}`),

    /**
     * Get Dosha Analysis for a specific client
     */
    getDoshaAnalysis: (clientId: string, doshaType: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/dosha/${doshaType}?ayanamsa=${ayanamsa}`),

    /**
     * Get system capabilities - which chart types are available per ayanamsa
     * SYNCED with backend endpoint-availability.ts (2026-01-21)
     */
    getSystemCapabilities: (system: string): SystemCapabilities => {
        const CAPABILITIES: Record<string, SystemCapabilities> = {
            lahiri: {
                charts: {
                    // Synced with backend - removed D6 and D150 (not supported)
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['moon_chart', 'sun_chart', 'sudarshana', 'transit'],
                    lagna: ['arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_summary'],
                    compatibility: ['synastry', 'composite', 'progressed'],
                    numerology: ['chaldean', 'lo_shu']
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: true,
                hasCompatibility: true,
                hasHorary: false,
            },
            raman: {
                charts: {
                    // No D6 or D150 for Raman
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['moon', 'sun', 'sudarshan', 'transit'],
                    lagna: ['arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_varga'],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: false,
            },
            kp: {
                charts: {
                    // KP: Only D1, no other divisional charts
                    divisional: ['D1'],
                    special: ['planets_cusps', 'shodasha_varga'],
                    lagna: []
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: false,
                hasAshtakavarga: false,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: true,
            },
        };
        return CAPABILITIES[system.toLowerCase()] || CAPABILITIES.lahiri;
    },
};

// ============ FAMILY API ============
// Family relationship management for Kundali matching and family charts
export const familyApi = {
    /**
     * Get all family links for a client
     */
    getFamilyLinks: (clientId: string): Promise<FamilyLink[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family`),

    /**
     * Link a family member to client
     * Creates bidirectional relationship (e.g., parent-child)
     */
    linkFamily: (clientId: string, data: FamilyLinkPayload): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family-link`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Remove family link
     */
    unlinkFamily: (clientId: string, relatedClientId: string): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family/${relatedClientId}`, {
            method: 'DELETE',
        }),
};

// ============ GEOCODE API ============
// Location services for accurate birth place coordinates
export const geocodeApi = {
    /**
     * Get location suggestions for autocomplete
     */
    getSuggestions: (query: string, limit: number = 5): Promise<{ suggestions: LocationSuggestion[] }> =>
        apiFetch(`${CLIENT_URL}/geocode/suggest?q=${encodeURIComponent(query)}&limit=${limit}`),

    /**
     * Get full geocoding result for a place
     */
    geocodePlace: (place: string): Promise<LocationSuggestion> =>
        apiFetch(`${CLIENT_URL}/geocode`, {
            method: 'POST',
            body: JSON.stringify({ place }),
        }),
};

