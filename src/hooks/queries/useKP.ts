import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { kpApi } from '@/lib/api';
import type {
    KpPlanetsCuspsResponse,
    KpRulingPlanetsResponse,
    KpBhavaDetailsResponse,
    KpSignificationsResponse,
    KpHoraryResponse,
} from '@/types/kp.types';

// =============================================================================
// KP (KRISHNAMURTI PADDHATI) QUERY HOOKS
// TanStack Query hooks for all KP endpoints
// =============================================================================

// Query key factory
export const kpKeys = {
    all: ['kp'] as const,
    planetsCusps: (clientId: string) => [...kpKeys.all, 'planets-cusps', clientId] as const,
    rulingPlanets: (clientId: string) => [...kpKeys.all, 'ruling-planets', clientId] as const,
    bhavaDetails: (clientId: string) => [...kpKeys.all, 'bhava-details', clientId] as const,
    significations: (clientId: string) => [...kpKeys.all, 'significations', clientId] as const,
    horary: (clientId: string, horaryNumber: number) => [...kpKeys.all, 'horary', clientId, horaryNumber] as const,
};

/**
 * Hook for fetching KP Planets and Cusps with sub-lords
 * Core chart data for KP system
 */
export function useKpPlanetsCusps(
    clientId: string,
    options?: Omit<UseQueryOptions<KpPlanetsCuspsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpPlanetsCuspsResponse, Error>({
        queryKey: kpKeys.planetsCusps(clientId),
        queryFn: () => kpApi.getPlanetsCusps(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000, // 10 minutes - chart data is stable
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching current Ruling Planets
 * Time-sensitive data - shorter cache
 */
export function useKpRulingPlanets(
    clientId: string,
    options?: Omit<UseQueryOptions<KpRulingPlanetsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpRulingPlanetsResponse, Error>({
        queryKey: kpKeys.rulingPlanets(clientId),
        queryFn: () => kpApi.getRulingPlanets(clientId),
        enabled: !!clientId,
        staleTime: 5 * 60 * 1000, // 5 minutes - time-sensitive
        refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Bhava (House) Details
 */
export function useKpBhavaDetails(
    clientId: string,
    options?: Omit<UseQueryOptions<KpBhavaDetailsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpBhavaDetailsResponse, Error>({
        queryKey: kpKeys.bhavaDetails(clientId),
        queryFn: () => kpApi.getBhavaDetails(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Significations
 * Which planets signify which houses (key for KP predictions)
 */
export function useKpSignifications(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: kpKeys.significations(clientId),
        queryFn: () => kpApi.getSignifications(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Mutation hook for KP Horary (Prashna)
 * Used as mutation since it requires user input each time
 */
export function useKpHoraryMutation() {
    return useMutation<KpHoraryResponse, Error, { clientId: string; horaryNumber: number; question: string }>({
        mutationFn: ({ clientId, horaryNumber, question }) =>
            kpApi.getHorary(clientId, horaryNumber, question),
    });
}
