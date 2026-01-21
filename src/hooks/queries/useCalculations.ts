import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { useMemo } from 'react';

export function useDasha(
    clientId: string,
    type: 'basic' | 'deep' | 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'sookshma' | 'prana' = 'basic',
    ayanamsa: string,
    context?: any
) {
    return useQuery({
        queryKey: ['dasha', clientId, type, ayanamsa, context],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateDasha(clientId, type, ayanamsa, false, context);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useOtherDasha(clientId: string, type: string, ayanamsa: string) {
    return useQuery({
        queryKey: ['dasha', 'other', clientId, type, ayanamsa],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateOtherDasha(clientId, type, ayanamsa);
        },
        enabled: !!clientId && type !== 'vimshottari',
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useSudarshanChakra(clientId: string, ayanamsa: string) {
    return useQuery({
        queryKey: ['sudarshan', clientId, ayanamsa],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateSudarshanChakra(clientId, ayanamsa);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useAshtakavarga(clientId: string, ayanamsa: string, type: string = 'bhinna') {
    return useQuery({
        queryKey: ['ashtakavarga', clientId, ayanamsa, type],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateAshtakavarga(clientId, ayanamsa, type);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useSystemCapabilities(system: string) {
    return useMemo(() => clientApi.getSystemCapabilities(system), [system]);
}
