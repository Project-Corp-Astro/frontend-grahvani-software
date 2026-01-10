"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, userApi } from "@/lib/api";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
    avatarUrl?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshProfile = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const profile = await userApi.getMe();
            setUser(profile);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            // If profile fetch fails, token might be invalid
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial load: check localStorage and fetch profile
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        refreshProfile();
    }, [refreshProfile]);

    const login = async (credentials: any) => {
        const response = await authApi.login(credentials);
        if (response.tokens?.accessToken) {
            localStorage.setItem("accessToken", response.tokens.accessToken);
            localStorage.setItem("user", JSON.stringify(response.user));
            setUser(response.user);
            router.push("/dashboard");
        } else {
            throw new Error("Invalid response from server");
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
