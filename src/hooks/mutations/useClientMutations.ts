import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { CreateClientPayload } from "@/types/client";

export function useClientMutations() {
    const queryClient = useQueryClient();

    const createClientMutation = useMutation({
        mutationFn: (data: CreateClientPayload) => clientApi.createClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    const updateClientMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientPayload> }) =>
            clientApi.updateClient(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
            // Also invalidate charts if birth details changed?
            queryClient.invalidateQueries({ queryKey: ['charts', variables.id] });
        },
    });

    const deleteClientMutation = useMutation({
        mutationFn: (id: string) => clientApi.deleteClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    return {
        createClient: createClientMutation,
        updateClient: updateClientMutation,
        deleteClient: deleteClientMutation
    };
}
