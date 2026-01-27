import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const isAuthenticated = Boolean(user);

  const ensureUser = useCallback(async () => {
    // sem hydrate: só retorna o que tiver
    return user ?? null;
  }, [user]);

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
    ensureUser,
  };
}
