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
        staleTime: 5000,
        refetchInterval: (query) => {
            const data = query.state.data as any;
            // If no data, poll fast (3s)
            if (!data || Object.keys(data).length === 0) return 3000;

            // If we have some data, check if we have the "complete" set.
            // A full profile typically has 15+ charts (D1-D60 + special).
            // If we have fewer than 5, we are definitely still generating.
            if (Object.keys(data).length < 5) return 3000;

            // Explicitly check for Transit chart (D1 is usually first)
            // If D1 exists but Transit is missing, keep polling (slower, 5s)
            // We check for any transit key to be safe
            const hasTransit = Object.keys(data).some(k => k.includes('transit'));
            if (!hasTransit) return 5000;

            return false;
        },
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
