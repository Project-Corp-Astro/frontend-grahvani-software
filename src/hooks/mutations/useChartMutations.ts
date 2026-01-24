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

    const generateFullVedicProfileMutation = useMutation({
        mutationFn: (clientId: string) => clientApi.generateFullVedicProfile(clientId),
        onSuccess: (_, clientId) => {
            queryClient.invalidateQueries({ queryKey: ['charts', clientId] });
        },
    });

    return {
        generateChart: generateChartMutation,
        generateFullVedicProfile: generateFullVedicProfileMutation,
        isGeneratingFull: generateFullVedicProfileMutation.isPending
    };
}
