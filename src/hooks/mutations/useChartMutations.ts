import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export function useChartMutations() {
    const queryClient = useQueryClient();

    const generateChartMutation = useMutation({
        mutationFn: ({ clientId, chartType, ayanamsa }: { clientId: string; chartType: string; ayanamsa: string }) =>
            clientApi.generateChart(clientId, chartType, ayanamsa),
        onSuccess: (_, variables) => {
            // Invalidate the specific client's charts
            queryClient.invalidateQueries({ queryKey: ['charts', variables.clientId] });
        },
    });

    const generateSudarshanMutation = useMutation({
        mutationFn: ({ clientId, ayanamsa }: { clientId: string; ayanamsa: string }) =>
            clientApi.generateSudarshanChakra(clientId, ayanamsa), // Note: API might be GET or POST, seemingly POST based on analysis
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sudarshan', variables.clientId] });
        }
    });

    return {
        generateChart: generateChartMutation,
        // generateSudarshan: generateSudarshanMutation // Sudarshan page uses fetch-on-load usually, but if it has a recalculate button...
    };
}
