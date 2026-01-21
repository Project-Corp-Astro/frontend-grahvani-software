import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export function useGenerateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clientId: string) => clientApi.generateFullVedicProfile(clientId),
        onSuccess: (_, clientId) => {
            // Invalidate charts cache to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['charts', clientId] });
        },
    });
}
