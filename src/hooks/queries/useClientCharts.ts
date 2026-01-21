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
        staleTime: 60 * 60 * 1000, // 1 hour
        select: (data) => {
            if (!Array.isArray(data)) return {};

            const lookup: ChartLookup = {};
            data.forEach((c: any) => {
                const system = (c.chartConfig?.system || 'lahiri').toLowerCase();
                const key = `${c.chartType}_${system}`;
                lookup[key] = c;
            });
            return lookup;
        }
    });
}
