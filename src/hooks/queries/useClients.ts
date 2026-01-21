import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export interface ClientQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
    city?: string;
    myClientsOnly?: boolean;
}

export function useClients(params: ClientQueryParams = {}) {
    return useQuery({
        queryKey: ['clients', params],
        queryFn: async () => {
            return await clientApi.getClients(params);
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
        staleTime: 1000 * 60, // 1 minute
    });
}

export function useClient(id?: string) {
    return useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            if (!id) throw new Error("Client ID is required");
            return await clientApi.getClient(id);
        },
        enabled: !!id,
        staleTime: 1000 * 60, // 1 minute
    });
}
