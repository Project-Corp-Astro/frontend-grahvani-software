import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuthTokenStore } from "@/store/useAuthTokenStore";

// We test the token store since apiFetch depends on fetch which is harder to unit test
describe("useAuthTokenStore", () => {
  beforeEach(() => {
    useAuthTokenStore.getState().clearTokens();
    vi.clearAllMocks();
  });

  it("starts with null tokens", () => {
    const state = useAuthTokenStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it("setTokens stores both tokens", () => {
    useAuthTokenStore.getState().setTokens("access123", "refresh456");
    const state = useAuthTokenStore.getState();
    expect(state.accessToken).toBe("access123");
    expect(state.refreshToken).toBe("refresh456");
  });

  it("setAccessToken updates only access token", () => {
    useAuthTokenStore.getState().setTokens("old-access", "refresh456");
    useAuthTokenStore.getState().setAccessToken("new-access");
    const state = useAuthTokenStore.getState();
    expect(state.accessToken).toBe("new-access");
    expect(state.refreshToken).toBe("refresh456");
  });

  it("clearTokens removes all tokens", () => {
    useAuthTokenStore.getState().setTokens("access123", "refresh456");
    useAuthTokenStore.getState().clearTokens();
    const state = useAuthTokenStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it("setTokens persists refresh token to localStorage", () => {
    useAuthTokenStore.getState().setTokens("access123", "refresh456");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "refresh456",
    );
  });

  it("clearTokens removes from localStorage", () => {
    useAuthTokenStore.getState().clearTokens();
    expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  it("tracks isRefreshing state", () => {
    expect(useAuthTokenStore.getState().isRefreshing).toBe(false);
    useAuthTokenStore.getState().setIsRefreshing(true);
    expect(useAuthTokenStore.getState().isRefreshing).toBe(true);
    useAuthTokenStore.getState().setIsRefreshing(false);
    expect(useAuthTokenStore.getState().isRefreshing).toBe(false);
  });
});

describe("authApi structure", () => {
  it("exports required API methods", async () => {
    const { authApi } = await import("./api");
    expect(authApi).toHaveProperty("login");
    expect(authApi).toHaveProperty("register");
    expect(authApi).toHaveProperty("logout");
    expect(authApi).toHaveProperty("refresh");
  });

  it("exports clientApi with required methods", async () => {
    const { clientApi } = await import("./api");
    expect(clientApi).toHaveProperty("getClients");
    expect(clientApi).toHaveProperty("getClient");
    expect(clientApi).toHaveProperty("createClient");
    expect(clientApi).toHaveProperty("updateClient");
    expect(clientApi).toHaveProperty("deleteClient");
    expect(clientApi).toHaveProperty("generateChart");
    expect(clientApi).toHaveProperty("generateDasha");
    expect(clientApi).toHaveProperty("getSystemCapabilities");
  });

  it("getSystemCapabilities returns valid structure for lahiri", async () => {
    const { clientApi } = await import("./api");
    const caps = clientApi.getSystemCapabilities("lahiri");
    expect(caps.hasDivisional).toBe(true);
    expect(caps.hasAshtakavarga).toBe(true);
    expect(caps.charts.divisional).toContain("D1");
    expect(caps.charts.divisional).toContain("D9");
  });

  it("getSystemCapabilities returns KP capabilities", async () => {
    const { clientApi } = await import("./api");
    const caps = clientApi.getSystemCapabilities("kp");
    expect(caps.hasDivisional).toBe(false);
    expect(caps.hasHorary).toBe(true);
    expect(caps.charts.divisional).toEqual(["D1"]);
  });

  it("getSystemCapabilities defaults to lahiri for unknown system", async () => {
    const { clientApi } = await import("./api");
    const caps = clientApi.getSystemCapabilities("unknown");
    expect(caps.hasDivisional).toBe(true);
  });
});
