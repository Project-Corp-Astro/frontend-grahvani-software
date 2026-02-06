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
    houseSignifications: (clientId: string) => [...kpKeys.all, 'house-significations', clientId] as const,
    planetSignificators: (clientId: string) => [...kpKeys.all, 'planet-significators', clientId] as const,
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
 * Hook for fetching House Significations (Table 1)
 */
export function useKpHouseSignifications(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: kpKeys.houseSignifications(clientId),
        queryFn: () => kpApi.getHouseSignifications(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Planet Significators (Table 2 - Matrix)
 */
export function useKpPlanetSignificators(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: kpKeys.planetSignificators(clientId),
        queryFn: () => kpApi.getPlanetSignificators(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching KP Cuspal Interlinks
 */
export function useKpInterlinks(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: [...kpKeys.all, 'interlinks', clientId],
        queryFn: () => kpApi.getInterlinks(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Advanced Interlinks (SSL)
 */
export function useKpAdvancedInterlinks(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: [...kpKeys.all, 'interlinks-advanced', clientId],
        queryFn: () => kpApi.getAdvancedInterlinks(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Nakshatra Nadi
 */
export function useKpNakshatraNadi(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: [...kpKeys.all, 'nakshatra-nadi', clientId],
        queryFn: () => kpApi.getNakshatraNadi(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Pars Fortuna
 */
export function useKpFortuna(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: [...kpKeys.all, 'fortuna', clientId],
        queryFn: () => kpApi.getFortuna(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
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
