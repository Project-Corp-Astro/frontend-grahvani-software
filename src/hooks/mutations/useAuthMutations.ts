import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuthMutations() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (credentials: any) => authApi.login(credentials),
        onSuccess: (data) => {
            if (data.tokens?.accessToken) {
                localStorage.setItem("accessToken", data.tokens.accessToken);
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.setQueryData(['userProfile'], data.user);
                router.push("/dashboard");
            }
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            queryClient.setQueryData(['userProfile'], null);
            queryClient.clear(); // Clear all cache on logout
            router.push("/login");
        },
    });

    return { loginMutation, logoutMutation };
}
