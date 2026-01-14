// API Utility for Grahvani Frontend
// Handles communication with microservices

import { CreateClientPayload, FamilyLinkPayload, Client, ClientListResponse, FamilyLink, LocationSuggestion } from '@/types/client';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001/api/v1';
const USER_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002/api/v1';
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:3003/api/v1';

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

