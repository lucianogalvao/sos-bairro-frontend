// src/shared/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, AuthUser } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      setUser: (user) => set({ user, isHydrated: true }),
      clearUser: () => set({ user: null, isHydrated: true }),

      hydrate: async () => {
        try {
          const res = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: { Accept: "application/json" },
          });

          if (!res.ok) {
            set({ user: null, isHydrated: true });
            return;
          }

          const json = await res.json();
          const user = (json?.user ?? json) as AuthUser;

          set({ user, isHydrated: true });
        } catch {
          set({ user: null, isHydrated: true });
        }
      },
    }),
    {
      name: "sosbairro-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setUser(state.user ?? null);
      },
    }
  )
);
