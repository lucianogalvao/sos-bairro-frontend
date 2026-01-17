import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const hydrateUser = useAuthStore((s) => s.hydrateUser);

  const isAuthenticated = Boolean(user);

  const ensureUser = useCallback(async () => {
    if (user) return user;
    return hydrateUser();
  }, [user, hydrateUser]);

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
    hydrateUser,
    ensureUser,
  };
}
