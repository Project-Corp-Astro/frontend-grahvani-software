import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export function useLocationSuggestions(query: string) {
    return useQuery({
        queryKey: ['locationSuggestions', query],
        queryFn: async () => {
            if (!query || query.length < 3) return { suggestions: [] };
            return await clientApi.getSuggestions(query);
        },
        enabled: !!query && query.length >= 3,
        staleTime: 1000 * 60 * 60, // 1 hour (locations don't change often)
    });
}
