"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Store the path they were trying to access to redirect back after login
            const searchParams = new URLSearchParams();
            searchParams.set('redirect', pathname);
            router.push(`/login?${searchParams.toString()}`);
        }
    }, [isAuthenticated, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-parchment">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-gold-primary animate-spin mx-auto mb-4" />
                    <p className="font-serif text-gold-dark font-medium">Authenticating Spirit...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
