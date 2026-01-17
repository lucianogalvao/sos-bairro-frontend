export type Role = "ADMIN" | "MODERADOR" | "MORADOR";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type AuthState = {
  user: AuthUser | null;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  hydrate: () => Promise<void>;
};
