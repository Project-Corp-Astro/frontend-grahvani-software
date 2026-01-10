"use client";

import VedicLayout from "@/components/vedic/VedicLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <VedicLayout>{children}</VedicLayout>
        </ProtectedRoute>
    );
}
