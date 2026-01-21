import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { familyApi } from "@/lib/api";
import { FamilyLinkPayload } from "@/types/client";

export function useFamilyLinks(clientId: string) {
    return useQuery({
        queryKey: ['familyLinks', clientId],
        queryFn: async () => {
            if (!clientId) return [];
            return await familyApi.getFamilyLinks(clientId);
        },
        enabled: !!clientId,
    });
}

export function useFamilyMutations() {
    const queryClient = useQueryClient();

    const linkFamilyMutation = useMutation({
        mutationFn: ({ clientId, payload }: { clientId: string, payload: FamilyLinkPayload }) =>
            familyApi.linkFamily(clientId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['familyLinks', variables.clientId] });
        },
    });

    const unlinkFamilyMutation = useMutation({
        mutationFn: ({ clientId, relatedClientId }: { clientId: string, relatedClientId: string }) =>
            familyApi.unlinkFamily(clientId, relatedClientId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['familyLinks', variables.clientId] });
        },
    });

    return { linkFamily: linkFamilyMutation, unlinkFamily: unlinkFamilyMutation };
}
