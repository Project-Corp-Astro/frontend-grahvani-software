import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

export function useUserProfile() {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return null;
            return await userApi.getMe();
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
