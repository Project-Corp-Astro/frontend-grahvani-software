import { create } from "zustand";

interface AuthTokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
  isRefreshing: boolean;
  setIsRefreshing: (v: boolean) => void;
}

export const useAuthTokenStore = create<AuthTokenState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isRefreshing: false,

  setTokens: (accessToken, refreshToken) => {
    // Store refresh token in localStorage for page refresh recovery
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", refreshToken);
    }
    set({ accessToken, refreshToken });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken"); // Clean up legacy storage
      localStorage.removeItem("user");
    }
    set({ accessToken: null, refreshToken: null });
  },

  setIsRefreshing: (v) => set({ isRefreshing: v }),
}));
