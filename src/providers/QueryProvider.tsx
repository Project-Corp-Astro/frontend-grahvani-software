"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        // Global query error handler — log non-401 errors
                        if (!error.message.includes("401")) {
                            console.error("[QueryCache] Query failed:", error.message);
                        }
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error) => {
                        console.error("[MutationCache] Mutation failed:", error.message);
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000 * 60, // 1 hour
                        retry: 3,
                        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
