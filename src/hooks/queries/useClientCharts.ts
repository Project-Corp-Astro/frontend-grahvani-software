import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export interface ChartLookup {
    [key: string]: any;
}

export function useClientCharts(clientId?: string) {
    return useQuery({
        queryKey: ['charts', clientId],
        queryFn: async () => {
            if (!clientId) return [];
            return await clientApi.getCharts(clientId);
        },
        enabled: !!clientId,
        staleTime: 60000, // Keep cache for 1 min
        refetchInterval: false, // DISABLED for performance audit (Phase 1 Fix)
        /*
        refetchInterval: (query) => {
            const data = query.state.data as any;

            // Optimization: Stop polling if we have > 20 charts (likely complete)
            if (data && Object.keys(data).length > 20) return false;

            // Optimization: If deep dasha or complex charts are missing, poll slower (15s)
            // If very few charts (fresh profile), poll 5s.
            if (!data || Object.keys(data).length < 5) return 5000;

            // Check for Transit chart (usually last to generate)
            const hasTransit = Object.keys(data).some(k => k.includes('transit'));
            if (!hasTransit) return 10000; // Poll every 10s instead of 5s

            return false;
        },
        */
        select: (data) => {
            if (!Array.isArray(data)) return {};

            const lookup: ChartLookup = {};
            data.forEach((c: any) => {
                // Prioritize ayanamsa field, fallback to system for backward compatibility with DB records
                const ayanamsa = (c.ayanamsa || c.chartConfig?.ayanamsa || c.system || c.chartConfig?.system || 'lahiri').toLowerCase();
                const key = `${c.chartType}_${ayanamsa}`;
                lookup[key] = c;
            });
            return lookup;
        }
    });
}
